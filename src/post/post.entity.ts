import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PostStatusEnum } from './enums/post-status.enum';
import { User } from '../users/user.entity';
import { Subject } from '../subject/subject.entity';
import { Label } from '../label/label.entity';

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

  @ManyToOne(
    type => Subject,
    subject => subject.posts,
  )
  subject: Subject;

  @ManyToMany(
    type => Label,
    label => label.posts,
  )
  @JoinTable()
  labels: Label[];
}
