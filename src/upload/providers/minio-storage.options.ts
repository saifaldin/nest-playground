import minioStorage from 'multer-minio-storage';
import * as config from 'config';
import { generateFileName } from './multer.options';
import { Client } from 'minio';

const { endPoint, protocol, accessKey, secretKey, bucket } = config.get(
  'upload_providers.minio',
);

const useSSL = protocol === 'https:';

const minioClient = new Client({
  endPoint,
  useSSL,
  accessKey,
  secretKey,
});

let key: string; // caching the key to use it when making url

const generateKey = (mimetype: string) => {
  key = generateFileName(mimetype);
};

export const minioStorageEngine = minioStorage({
  minioClient,
  bucket,
  key: (req, file, cb) => {
    generateKey(file.mimetype);
    cb(null, key);
  },
  metadata: (req, file, cb) => {
    try {
      const url = `${protocol}//${endPoint}/${bucket}/${key}`;
      return cb(null, { url });
    } catch (error) {
      return cb(error);
    }
  },
  contentType: (req, file, cb) => cb(null, file.mimetype),
});

// in minioStorage storage engine options, key must be called before metadata
// to be able to cache the key value and use it later in metadata
