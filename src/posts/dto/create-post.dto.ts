import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreatePostDto {
  // @IsString({ message: 'caption must be a valid string' })
  caption: string;
  // @IsBoolean()
  isHidden: boolean;
  // @IsArray()
  options: (string | Express.Multer.File)[];
}
