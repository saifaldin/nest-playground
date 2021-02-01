import {
  Injectable,
  InternalServerErrorException,
  Req,
  Res,
} from '@nestjs/common';
import * as multer from 'multer';
import { providers } from './providers/enum/providers.enum';
import { fileFilter } from './providers/multer.options';
import { cloudinaryStorageEngine } from './providers/cloudinary.storage';
import {
  changeMinioResult,
  minioStorageEngine,
} from './providers/minio.storage';

const allAvailableProviders = [providers.CLOUDINARY, providers.MINIO];

// Setting up the use of providers enum
const storage = {
  [providers.CLOUDINARY]: cloudinaryStorageEngine,
  [providers.MINIO]: minioStorageEngine,
};

const fixRepetition = (body, fieldRepeats) => {
  // Text input fields sibling to the files, are REPEATED into an array.
  // Number of repetitions = Number of the times the files have been uploaded
  // = Number of providers in selectedProviders array
  let { caption, isHidden, options } = body;
  caption = caption[0];
  isHidden = isHidden[0];
  options = options.reduce(function (allOptions, option) {
    if (option in allOptions) {
      allOptions[option]++;
    } else {
      allOptions[option] = 1;
    }
    return allOptions;
  }, {});

  const fixedOptions = [];

  for (const option in options) {
    for (let i = 0; i < options[option] / fieldRepeats; i++) {
      fixedOptions.push(option);
    }
  }

  return { caption, isHidden, options: fixedOptions };
};

@Injectable()
export class UploadService {
  uploadPromises = [];
  async reslovePromises(req, fieldRepetition): Promise<Express.Multer.File[]> {
    await Promise.all(this.uploadPromises);
    if (fieldRepetition <= 1) {
      return req.files;
    }
    req.body = fixRepetition(req.body, fieldRepetition);
    this.uploadPromises = [];
    return req.files;
  }

  uploadToOneProvider(
    req,
    res,
    provider: providers,
    fieldName = 'options',
    maxNumber = 4,
  ) {
    const upload = multer({
      storage: storage[provider],
      fileFilter,
    });

    // Promisification of the multer upload middleware
    const uploadPromise = new Promise((resolve, reject) => {
      upload.array(fieldName, maxNumber)(req, res, (err) => {
        if (err) throw new InternalServerErrorException(err.message);
        if (provider === providers.MINIO)
          req.files = changeMinioResult(req.files);
        resolve(req.files);
      });
    });
    this.uploadPromises.push(uploadPromise);
    return uploadPromise;
  }

  uploadToMultipleProviders(
    req,
    res,
    selectedProviders = allAvailableProviders,
  ) {
    for (const provider of selectedProviders) {
      const uploadPromise = this.uploadToOneProvider(req, res, provider);
      this.uploadPromises.push(uploadPromise);
    }
    return this.reslovePromises(req, selectedProviders.length);
  }

  uploadToOneRandomProvider(
    req,
    res,
    selectedProviders = allAvailableProviders,
  ) {
    const random = Math.ceil(selectedProviders.length * Math.random());
    return this.uploadToOneProvider(req, res, selectedProviders[random - 1]);
  }

  // uploadToFastestProvider(req, res, selectedProviders = allAvailableProviders) {
  //   const promises = [];
  //   for (const provider of selectedProviders) {
  //     const promise = this.uploadToOneProvider(req, res, provider);
  //     promises.push(promise);
  //   }
  //   return Promise.race(promises);
  // }
}
