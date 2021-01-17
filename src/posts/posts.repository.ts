import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/filter.dto';
import { Posts } from './posts.entity';

@EntityRepository(Posts)
export class PostsRepository extends Repository<Posts> {
  async getPosts(getPostsFilterDto: GetPostsFilterDto) {
    const { limit, skip } = getPostsFilterDto;
    const query = this.createQueryBuilder('posts').orderBy(
      'posts.createdAt',
      'DESC',
    );
    if (limit) query.limit(limit);
    if (skip) query.offset(skip);
    const posts = await query.execute();
    return { posts };
  }
  async createPost(req, createPostDto: CreatePostDto) {
    const { title, options } = createPostDto;
    const post = new Posts();
    post.title = title;
    post.options = options;
    post.author = req.user;
    await post.save();
    return { ...post, author: { ...req.user, password: undefined } };
  }
}
