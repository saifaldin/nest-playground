export class CreatePostDto {
  caption: string;
  isHidden: boolean;
  options: (string | Express.Multer.File)[];
}
