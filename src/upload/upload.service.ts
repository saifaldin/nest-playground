import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { providers } from './providers/enum/providers.enum';
import { fileFilter } from './providers/multer.options';
import { cloudinaryStorageEngine } from './providers/cloudinary.storage';
import {
  changeMinioResult,
  minioStorageEngine,
} from './providers/minio.storage';
const multer = require('multer');

const allAvailableProviders = [providers.CLOUDINARY, providers.MINIO];

// Setting up the use of providers enum
const storage = {
  [providers.CLOUDINARY]: cloudinaryStorageEngine,
  [providers.MINIO]: minioStorageEngine,
};

@Injectable()
export class UploadService {
  uploadNone() {
    return multer().any();
  }
  uploadToOneProvider(
    req,
    res,
    provider: providers,
    fieldName = 'options',
    maxNumber = 4,
  ): Promise<Express.Multer.File[]> {
    const upload = multer({
      storage: storage[provider],
      fileFilter,
    });

    // Promisification of the multer upload middleware
    return new Promise((resolve, reject) => {
      upload.array(fieldName, maxNumber)(req, res, (err) => {
        if (err) throw new InternalServerErrorException(err.message);
        // if (provider === providers.MINIO)
        //   req.files = changeMinioResult(req.files);
        resolve(req.files);
      });
    });
  }

  uploadToMultipleProviders(
    req,
    res,
    selectedProviders = allAvailableProviders,
  ) {
    const promises = [];
    for (const provider of selectedProviders) {
      const promise = this.uploadToOneProvider(req, res, provider);
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  uploadToOneRandomProvider(
    req,
    res,
    selectedProviders = allAvailableProviders,
  ) {
    const random = Math.ceil(selectedProviders.length * Math.random());
    return this.uploadToOneProvider(req, res, selectedProviders[random - 1]);
  }

  uploadToFastestProvider(req, res, selectedProviders = allAvailableProviders) {
    const promises = [];
    for (const provider of selectedProviders) {
      const promise = this.uploadToOneProvider(req, res, provider);
      promises.push(promise);
    }
    return Promise.race(promises);
  }
}
