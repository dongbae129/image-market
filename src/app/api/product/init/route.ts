import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuIdV4 } from 'uuid';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextRequest, NextResponse } from 'next/server';

// type FileInfosProps = {
//   name: string;
//   ext: string;
// };
export const POST = async (req: NextRequest) => {
  // const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const { fileInfos } = await req.json();

  const s3 = new S3Client({
    region: process.env.AWS_REGION!
  });

  const tickets = await Promise.all(
    fileInfos.map(async (info: { name: string; ext: string }) => {
      const uuid = uuIdV4();
      const tempKey = `temp/${uuid}.${info.ext}`;
      const tempUrl = tempKey.slice(5);
      const { url, fields } = await createPresignedPost(s3, {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: tempKey,
        Conditions: [
          ['content-length-range', 0, 10485760], // 파일 크기 최대 10MB 강제
          ['starts-with', '$Content-Type', 'image/'] // 이미지 파일만 허용
        ],
        Expires: 60 // 🌟 60초 뒤 티켓 폐기 (리플레이 공격 최소화)
      });
      return { url, fields, tempUrl };
    })
  );
  return NextResponse.json({
    ok: true,

    tickets
    // tempKey,
    // url,
    // fields,
    // filetype
  });
  // const { url, fields } = await createPresignedPost(s3, {
  //   Bucket: process.env.AWS_S3_BUCKET_NAME!,
  //   Key: tempKey,
  //   Conditions: [
  //     ['content-length-range', 0, 10485760], // 파일 크기 최대 10MB 강제
  //     ['starts-with', '$Content-Type', 'image/'] // 이미지 파일만 허용
  //   ],
  //   Expires: 60 // 🌟 60초 뒤 티켓 폐기 (리플레이 공격 최소화)
  // });
};
