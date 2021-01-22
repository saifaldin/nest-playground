import multer from 'multer';
import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const acceptedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  if (acceptedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'please upload an image with one of the accepted formats: "image/jpg", "image/jpeg", "image/png" ',
      ),
    );
  }
};

export const generateFileName = (mimetype: string) => {
  const name = `${
    Math.random().toString().split('.')[1] + Date.now().toString()
  }.${mimetype.split('/')[1]}`;
  return name;
};
