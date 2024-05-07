import fileStorageConfig from '@/config/fileStorageConfig';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import omit from 'lodash/omit';
import { UploadedFile } from 'express-fileupload';

function getUrlFromBucket(fileName: string): string {
  const { s3Config } = fileStorageConfig();

  return `https://${s3Config.bucket}.s3.${
    s3Config.region
  }.amazonaws.com/${encodeURI(fileName)}`;
}

async function upload(path: string, file: UploadedFile): Promise<string> {
  const { s3Config } = fileStorageConfig();
  const s3Client = new S3Client(omit(s3Config, ['bucket']));

  const filePath = `${path}${file.name}`;

  const bucketParams = {
    ACL: ObjectCannedACL.public_read,
    Bucket: s3Config.bucket,
    Key: filePath,
    Body: file.data,
  };

  try {
    await s3Client.send(new PutObjectCommand(bucketParams));

    return getUrlFromBucket(filePath);
  } catch (err) {
    console.error('File upload error', err);

    return '';
  }
}

export { upload };
