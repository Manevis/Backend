import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatusEnum } from './enums/user-status.enum';
import { Exclude } from 'class-transformer';
import { Post } from '../post/post.entity';
import { Photo } from '../photo/photo.entity';

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

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Exclude()
  @Column({ select: false })
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
    post => post.user,
    {
      cascade: true,
    },
  )
  posts: Post[];

  @OneToMany(
    type => Photo,
    photo => photo.user,
    {
      cascade: true,
    },
  )
  photos: Photo[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string;
}
