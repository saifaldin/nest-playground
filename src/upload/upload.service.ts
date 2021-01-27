import { Injectable } from '@nestjs/common';
import { providers } from './providers/enum/providers.enum';
import { fileFilter } from './providers/multer.options';
import { cloudinaryStorageEngine } from './providers/cloudinary-storage.options';
import { minioStorageEngine } from './providers/minio-storage.options';
const multer = require('multer');

@Injectable()
export class UploadService {
  uploadService(
    req,
    res,
    provider: providers,
    fieldName = 'options',
    maxNumber = 4,
  ): Promise<Express.Multer.File[]> {
    //
    // Setting up the use of providers enum
    const storage = {
      [providers.CLOUDINARY]: cloudinaryStorageEngine,
      [providers.MINIO]: minioStorageEngine,
    };

    const upload = multer({
      storage: storage[provider],
      fileFilter,
    });

    // Promisification of the middleware
    return new Promise((resolve, reject) => {
      upload.array(fieldName, maxNumber)(req, res, (err) => {
        if (err) reject(err);
        resolve(req.files);
      });
    });
  }
}
