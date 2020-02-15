import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable, BaseEntity, CreateDateColumn,
} from 'typeorm';
import { PostStatusEnum } from './enums/post-status.enum';
import { User } from '../users/user.entity';
import { Subject } from '../subject/subject.entity';
import { Label } from '../label/label.entity';

@Entity()
export class Post extends BaseEntity {
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
    subject => subject.posts, {
      cascade: true,
      eager: true,
    },
  )
  subject: Subject;

  @ManyToMany(
    type => Label,
    label => label.posts, {
      cascade: true,
      eager: true,
    },
  )
  @JoinTable()
  labels: Label[];

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;
}
