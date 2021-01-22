import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { storage } from 'src/options/file-upload/cloudinary-storage.options';
import { fileFilter } from 'src/options/file-upload/multer.options';
import { User } from 'src/users/user.decorator';
import { Users } from 'src/users/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

const multerOptions: MulterOptions = { storage, fileFilter };

@Controller('posts')
@UseGuards(AuthGuard('firebase-jwt'))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get('/:id')
  getOnePost(@Param('id') postId: number) {
    return this.postsService.getPosts(postId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('options', 4, multerOptions))
  createPost(
    @Body('options') textOptions: string[],
    @UploadedFiles() files: Express.Multer.File[],
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @User() currentUser: Users,
  ) {
    if (files.length) createPostDto.options = files;
    else createPostDto.options = textOptions;

    return this.postsService.createPost(createPostDto, currentUser);
  }
}
