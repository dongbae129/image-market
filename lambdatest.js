import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand // 🌟 [추가] 찌꺼기 삭제용
} from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js'; // 🌟 [추가] DB 업데이트용
import sharp from 'sharp';

const s3 = new S3Client({});

// 🌟 [추가] Supabase 클라이언트 초기화 (람다 환경 밖에서 1번만 실행)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // RLS 우회 권한 키
);

// 환경변수 로드
const BUCKET_NAME = process.env.BUCKET_NAME;
const SOURCE_PREFIX = process.env.SOURCE_PREFIX || 'original/';
const TARGET_474_PREFIX = process.env.TARGET_474_PREFIX || '474x/';
const TARGET_736_PREFIX = process.env.TARGET_736_PREFIX || '736x/';

const SUPPORTED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif']);

const contentTypeByFormat = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif'
};

/**
 * S3 스트림을 버퍼로 변환 (기존 코드 유지)
 */
const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

/**
 * 리사이징 및 업로드 공통 함수 (DB에 URL을 넣기 위해 최종 key 반환 추가)
 */
async function resizeAndUpload({ baseImage, key, width, format }) {
  const pipeline = baseImage.clone().resize({
    width,
    withoutEnlargement: true
  });

  let body;
  const contentType = contentTypeByFormat[format] || 'image/jpeg';

  switch (format) {
    case 'png':
      body = await pipeline.png({ compressionLevel: 9 }).toBuffer();
      break;
    case 'webp':
      body = await pipeline.webp({ quality: 82 }).toBuffer();
      break;
    case 'avif':
      body = await pipeline.avif({ quality: 50 }).toBuffer();
      break;
    case 'jpeg':
    default:
      body = await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
      break;
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );

  return key; // 🌟 [추가] 업로드된 S3 Key 반환
}
async function processSingleImage(tempKey) {
  // board에서 tempKey는 boardImageId,tempUrl
  const fileNameWithExt = tempKey.tempUrl.split('/').pop();
  const fileName = fileNameWithExt.split('.')[0];

  // 1. 원본 다운로드
  const response = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: tempKey.tempUrl })
  );
  const inputBuffer = await streamToBuffer(response.Body);

  // 2. 메타데이터 및 포맷 확인
  const baseImage = sharp(inputBuffer, { failOn: 'none' }).rotate();
  const metadata = await baseImage.metadata();
  const format = metadata.format?.toLowerCase() || 'jpeg';

  if (!SUPPORTED_FORMATS.has(format))
    throw new Error(`Unsupported format: ${format}`);

  // 3. 대표 색상(Dominant Color) 및 블러(LQIP) 추출
  const { channels } = await baseImage.stats();
  const [r, g, b] = channels.map((c) => Math.round(c.mean));
  const dominantColor = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

  const blurBuffer = await baseImage
    .clone()
    .resize(10, 10, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer();
  const lqip = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  const finalExt = format === 'jpeg' ? 'jpg' : format;
  const keyOriginal = `${SOURCE_PREFIX}${fileName}.${finalExt}`;
  const key474 = `${TARGET_474_PREFIX}${fileName}.${finalExt}`;
  const key736 = `${TARGET_736_PREFIX}${fileName}.${finalExt}`;

  // 4. 리사이징 업로드 + 원본 복사 병렬 처리
  await Promise.all([
    resizeAndUpload({ baseImage, key: key474, width: 474, format }),
    resizeAndUpload({ baseImage, key: key736, width: 736, format }),
    s3.send(
      new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        // 🚨 [핵심 방어] 띄어쓰기 에러 방지를 위한 URL 인코딩 적용!!
        CopySource: `${BUCKET_NAME}/${encodeURIComponent(tempKey.tempUrl)}`,
        Key: keyOriginal
      })
    )
  ]);

  // DB에 저장할 결과물 반환
  return {
    optimizedUrl: key736,
    dominantColor,
    lqip,
    targetId: tempKey.boardImageId.id
  };
}
export const handler = async (event) => {
  if (!BUCKET_NAME || !process.env.SUPABASE_URL) {
    throw new Error('Missing critical environment variables');
  }

  // ⭐️ 1. SQS 부분 실패 응답용 배열 (완벽한 패턴입니다!)
  const batchItemFailures = [];

  for (const sqsRecord of event.Records ?? []) {
    // 트러블슈팅을 위한 변수 사전 선언
    let feenId = null;
    let tempKeys = [];
    let tableType = null;
    try {
      // ⭐️ 2. [아키텍처 변경] 이제 S3 이벤트가 아니라, Next.js API가 보낸 직통 JSON입니다.
      const payload = JSON.parse(sqsRecord.body);
      feenId = payload.feenId;
      tempKeys = payload.tempKeys || []; // 예: "temp/1234-abcd.png"
      tableType = payload.tableType;

      if (!feenId || tempKeys.length === 0) {
        console.error('Invalid SQS payload:', payload);
        continue; // 페이로드가 깨진 경우 재시도해도 의미 없으므로 실패 목록에 안 넣음 (버림)
      }
      const processedImages = await Promise.all(
        tempKeys.map((tempKey) => processSingleImage(tempKey))
      );
      // // 파일명 및 원본 확장자 추출
      // const fileNameWithExt = tempKey.split("/").pop(); // "1234-abcd.png"
      // const fileName = fileNameWithExt.split(".")[0]; // "1234-abcd"

      // // ⭐️ 3. 원본 가져오기
      // const response = await s3.send(
      //   new GetObjectCommand({ Bucket: BUCKET_NAME, Key: tempKey })
      // );
      // const inputBuffer = await streamToBuffer(response.Body);

      // // ⭐️ 4. 포맷 확인 및 리사이징 (기존 코드 유지)
      // const baseImage = sharp(inputBuffer, { failOn: "none" }).rotate();
      // const metadata = await baseImage.metadata();
      // const format = metadata.format?.toLowerCase() || "jpeg"; // 기본값 폴백 추가

      // if (!SUPPORTED_FORMATS.has(format)) {
      //   throw new Error(`Unsupported format [${format}] for Feen ${feenId}`);
      // }

      // const { channels } = await baseImage.stats();
      // const [r, g, b] = channels.map(c => Math.round(c.mean));
      // // RGB를 HEX 코드(예: #4a90e2)로 변환
      // const dominantColor = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;

      // const blurBuffer = await baseImage.clone().resize(10, 10, { fit: 'inside' }).webp({ quality: 20 }).toBuffer();
      // const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

      // const finalExt = format === "jpeg" ? "jpg" : format; // 확장자 맞춤

      // // 🌟 3. [아키텍처 변경] 리사이징 업로드 + 원본 복사(Copy)를 병렬로 동시 실행!
      // const keyOriginal = `${SOURCE_PREFIX}${fileName}.${finalExt}`; // 예: original/1234.jpg
      // // ⭐️ 5. 리사이징 업로드 병렬 처리
      // const [key474, key736] = await Promise.all([
      //   resizeAndUpload({
      //     baseImage,
      //     key: `${TARGET_474_PREFIX}${fileName}.${finalExt}`,
      //     width: 474,
      //     format,
      //   }),
      //   resizeAndUpload({
      //     baseImage,
      //     key: `${TARGET_736_PREFIX}${fileName}.${finalExt}`,
      //     width: 736,
      //     format,
      //   }),
      //   s3.send(new CopyObjectCommand({
      //     Bucket: BUCKET_NAME,
      //     CopySource: `${BUCKET_NAME}/${tempKey}`, // 복사할 원본의 전체 경로 (버킷명 포함)
      //     Key: keyOriginal // 도착할 새 경로
      //   }))
      // ]);
      let dbError = null;
      // ⭐️ 6. [추가] Supabase DB 상태 업데이트 (READY)
      // 🚨 S3 업로드가 성공한 뒤에만 이 코드가 실행됩니다 (멱등성 방어의 핵심)
      switch (tableType) {
        case 'PRODUCT':
          const img = processedImages[0];
          const { error: productError } = await supabase
            .from('Product')
            .update({
              status: 'READY',
              dominantColor: img.dominantColor,
              lqip: img.lqip
            })
            .eq('id', feenId);
          dbError = productError;
          break;

        case 'BOARD':
          console.log(processedImages, 'processedImages');
          const boardImagesData = processedImages.map((img, index) => ({
            board_id: feenId,
            sort_order: index, // 캐러셀 순서 보장
            dominant_color: img.dominantColor,
            targetId: img.targetId
          }));
          for (const boardImage of boardImagesData) {
            const { error: err2 } = await supabase
              .from('BoardImage')
              // ⭐️ status 업데이트 없음!
              // 글은 이미 공개되어 있고, 고품질 썸네일 정보만 슬쩍 추가해 줍니다.
              .update({
                status: 'READY',
                dominantColor: boardImage.dominant_color
              })
              .eq('id', boardImage.targetId);
            dbError = err2;
          }
          break;

        default:
          tableType = 'Product';
      }

      if (dbError)
        throw new Error(`Supabase Update Failed: ${dbError.message}`);

      // ⭐️ 7. [추가] 원본(Temp) 이미지 삭제 (가장 마지막에 실행)
      console.log(tempKeys, 'tempKeys');
      await Promise.all(
        tempKeys.map((tempKey) =>
          s3.send(
            new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: tempKey.tempUrl
            })
          )
        )
      );
      // await s3.send(
      //   new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: tempKey })
      // );

      console.log(`[SUCCESS] Processed ${tableType} ID: ${feenId}`);
    } catch (error) {
      console.error(
        `[ERROR] SQS Message [${sqsRecord.messageId}] Feen ID [${feenId}]:`,
        error,
        dbError
      );
      // 에러가 났을 때만 batchItemFailures에 넣어서 SQS가 '얘만' 재시도하도록 만듭니다.
      batchItemFailures.push({ itemIdentifier: sqsRecord.messageId });
    }
  }

  // ⭐️ 8. 실패한 메시지만 SQS로 다시 반환
  return { batchItemFailures };
};
