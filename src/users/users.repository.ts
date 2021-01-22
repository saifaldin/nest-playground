import { Posts } from 'src/posts/posts.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Users } from './users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async createUser(
    name: string,
    email: string,
    picture: string,
  ): Promise<Users> {
    const newUser = new Users(name, email, picture, [], []);
    await newUser.save();
    return newUser;
  }
  async addPostToUser(user: Users, newPost: Posts): Promise<void> {
    if (!user.posts) user.posts = [newPost];
    else user.posts = [...user.posts, newPost];
    await user.save();
  }
  hasAlreadyVoted(currentUser: Users, post: Posts) {
    const found = currentUser.votedPosts.find(
      (votedPost) => votedPost.id === post.id,
    );
    if (found) return true;
    else return false;
  }
  async addPostToVoted(currentUser: Users, post: Posts) {
    currentUser.votedPosts.push(post);
    await currentUser.save();
  }
}
