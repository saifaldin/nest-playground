import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/filter.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  async getPosts(@Query(ValidationPipe) getPostsFilterDto: GetPostsFilterDto) {
    return this.postsService.getPosts(getPostsFilterDto);
  }
  async getOnePost() {}

  @Post()
  async createPost(
    @Req() req,
    @Body(ValidationPipe) createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(req, createPostDto);
  }
}
