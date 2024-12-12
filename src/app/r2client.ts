import { S3Client } from '@aws-sdk/client-s3';

export const R2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.NEXT_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.NEXT_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_R2_SECRET_ACCESS_KEY!
  },
  forcePathStyle: true
});
