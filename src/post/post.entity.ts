import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { PostStatusEnum } from './enums/post-status.enum';
import { User } from '../users/user.entity';
import { Subject } from '../subject/subject.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: PostStatusEnum,
    default: PostStatusEnum.DRAFT,
  })
  status: string;

  @ManyToOne(
    type => User,
    user => user.posts,
  )
  user: User;

  @ManyToOne(type => Subject, subject => subject.posts)
  subject: Subject;
}
