import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UploadService } from 'src/upload/upload.service';
import { isTruthy } from 'src/utility/isTruthy';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
// @UseGuards(AuthGuard('firebase-jwt'))
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
  async createPost(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @Body('options') textOptions,
    @Req() req,
  ) {
    if (req.files.length) createPostDto.options = req.files;
    else createPostDto.options = textOptions;
    console.log(createPostDto);
    createPostDto.isHidden = isTruthy(createPostDto.isHidden);
    const result = await this.postsService.createPost(createPostDto, req.user);
    return result;
  }
}
