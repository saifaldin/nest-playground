import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/filter.dto';
import { Posts } from './posts.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: PostsRepository,
  ) {}
  async getPosts(getPostsFilterDto: GetPostsFilterDto) {
    const posts = await this.postsRepository.getPosts(getPostsFilterDto);
    return posts;
  }
  async getOnePost() {}
  async createPost(req, createPostDto: CreatePostDto) {
    const post = await this.postsRepository.createPost(req, createPostDto);
    return post;
  }
}
