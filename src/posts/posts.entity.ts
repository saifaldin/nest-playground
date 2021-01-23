import { Options } from 'src/options/options.entity';
import { Users } from 'src/users/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caption: string;

  @Column()
  isHidden: boolean;

  @OneToMany(() => Options, (option) => option.post)
  options: Options[];

  @ManyToOne(() => Users, (user) => user.posts)
  author: Users;

  @CreateDateColumn()
  createdAt: Date;

  constructor(
    caption: string,
    isHidden: boolean,
    options: Options[],
    author: Users,
  ) {
    super();
    this.caption = caption;
    this.isHidden = isHidden;
    this.options = options;
    this.author = author;
  }
}
