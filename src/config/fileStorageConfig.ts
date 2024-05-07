function fileStorageConfig() {
  const s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
    bucket: process.env.AWS_BUCKET,
  };

  return {
    s3Config,
  };
}

export default fileStorageConfig;
