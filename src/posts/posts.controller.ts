import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '../users/user.decorator';
import { Users } from '../users/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

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
  @UseInterceptors(FilesInterceptor('options', 4))
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
