import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as config from 'config';
import { generateFileName } from './multer.options';

const { cloud_name, api_key, api_secret, folder_name } = config.get(
  'upload_providers.cloudinary',
);

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export default new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
      folder: folder_name || 'temp',
      public_id: generateFileName(file.mimetype),
    };
  },
});
