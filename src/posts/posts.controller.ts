import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { providers } from 'src/upload/providers/enum/providers.enum';
import { UploadService } from 'src/upload/upload.service';
import { User } from '../users/user.decorator';
import { Users } from '../users/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(AuthGuard('firebase-jwt'))
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadService: UploadService,
  ) {}

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
    const result = await this.postsService.createPost(createPostDto, req.user);
    return result;
  }
}
