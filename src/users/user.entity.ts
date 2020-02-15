import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany, BaseEntity, CreateDateColumn,
} from 'typeorm';
import { UserStatusEnum } from './enums/user-status.enum';
import { Exclude } from 'class-transformer';
import { Post } from '../post/post.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  links: string;

  @Column({ type: 'text' })
  biography: string;

  @Column()
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.RECEIVED_ACTIVATION_EMAIL,
  })
  status: string;

  @OneToMany(
    type => Post,
    post => post.user, {
      cascade: true,
    },
  )
  posts: Post[];

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;
}
