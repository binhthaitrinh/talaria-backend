const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

// uploads a file to s3
export function uploadFile(file, fileName) {
  //   const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: 'talaria-order',
    Body: file,
    Key: fileName,
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// downloads a file from s3
export function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: 'talaria-order',
  };

  return s3.getObject(downloadParams).createReadStream();
}
