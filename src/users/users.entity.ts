import { Posts } from 'src/posts/posts.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name', 'email'])
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  picture: string;

  @OneToMany(() => Posts, (post) => post.author)
  posts: Posts[];

  @ManyToMany(() => Posts)
  @JoinTable()
  votedPosts: Posts[];

  constructor(
    name: string,
    email: string,
    picture: string,
    posts: Posts[],
    votedPosts: Posts[],
  ) {
    super();
    this.name = name;
    this.email = email;
    this.picture = picture;
    this.posts = posts;
    this.votedPosts = votedPosts;
  }
}
