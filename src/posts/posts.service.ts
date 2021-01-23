import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Options } from '../options/options.entity';
import { OptionsRepository } from '../options/options.repository';
import { Users } from '../users/users.entity';
import { UsersRepository } from '../users/users.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './posts.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: PostsRepository,
    @InjectRepository(Options) private optionsRepository: OptionsRepository,
  ) {}

  async getPosts(postId?: number) {
    const posts = await this.postsRepository.getPosts(postId);
    return posts;
  }

  // async getPostById(postId: number): Promise<Posts> {}

  async createPost(createPostDto: CreatePostDto, currentUser: Users) {
    // Create new options
    const newOptions = await this.optionsRepository.createOptions(
      createPostDto.options,
    );

    // Create new post
    const newPost = await this.postsRepository.createPost(
      createPostDto,
      currentUser,
      newOptions,
    );

    delete newPost.author.posts;
    return newPost;
  }
}
