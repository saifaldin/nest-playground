import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from '../posts/posts.entity';
import { OptionType } from './option-type.enum';

@Entity()
export class Options extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: OptionType;

  @Column()
  title: string;

  @Column({ default: '0' })
  votes: number;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  provider: string;

  @ManyToOne(() => Posts, (post) => post.options)
  post: Posts;

  constructor(
    type: OptionType,
    title?: string,
    url?: string,
    provider?: string,
  ) {
    super();
    this.type = type;
    this.title = title;
    this.url = url;
    this.provider = provider;
  }
}
