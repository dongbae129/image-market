import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuIdV4 } from 'uuid';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextResponse } from 'next/server';

export const POST = async (req: NextRequest, res: NextResponse) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;

  const file = await req.json();
  const uuid = uuIdV4();
  console.log(file, 'file');
  const filetype = file.type.split('/')[1];
  const tempKey = `temp/${uuid}.${filetype}`;

  const s3 = new S3Client({
    region: process.env.AWS_REGION!
  });
  // const command = new PutObjectCommand({
  //   Bucket: bucketName,
  //   Key: tempKey,
  //   ContentType: file.type,
  // });

  // const url = await getSignedUrl(s3, command, {
  //   expiresIn: 60 * 5,
  // });
  const { url, fields } = await createPresignedPost(s3, {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: tempKey,
    Conditions: [
      ['content-length-range', 0, 10485760], // 파일 크기 최대 10MB 강제
      ['starts-with', '$Content-Type', 'image/'] // 이미지 파일만 허용
    ],
    Expires: 60 // 🌟 60초 뒤 티켓 폐기 (리플레이 공격 최소화)
  });
  return NextResponse.json({
    ok: true,
    data: {
      tempKey,
      url,
      fields
    }
  });
};
