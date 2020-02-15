import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    type => Post,
    post => post.subject,
  )
  posts: Post[];

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;
}