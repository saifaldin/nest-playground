import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from './cloudinary-storage.options';
import { fileFilter } from './multer.options';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FilesInterceptor('options', 4, { storage: cloudinaryStorage, fileFilter }),
  )
  cloudinaryUpload(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    return files;
  }
}
