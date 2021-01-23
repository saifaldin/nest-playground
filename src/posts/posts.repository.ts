import { Options } from '../options/options.entity';
import { Users } from '../users/users.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './posts.entity';

@EntityRepository(Posts)
export class PostsRepository extends Repository<Posts> {
  async getPosts(postId?: number) {
    if (postId) {
      const post = await this.findOne(postId, {
        relations: ['author', 'options'],
      });
      if (post.isHidden) delete post.author;
      return post;
    }

    let posts = await this.find({
      order: { createdAt: 'DESC' },
      relations: ['author', 'options'],
    });
    posts = posts.map((post) => {
      if (post.isHidden) delete post.author;
      return post;
    });
    return { posts };
  }

  async createPost(
    createPostDto: CreatePostDto,
    currentUser: Users,
    options: Options[],
  ) {
    const { caption, isHidden } = createPostDto;
    let newPost = new Posts(caption, !!isHidden, options, currentUser);
    newPost = await newPost.save();
    return newPost;
  }
}
