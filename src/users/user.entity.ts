import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';
import { UserStatusEnum } from './enums/user-status.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  links: string;

  @Column({ nullable: true, type: 'text' })
  biography: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.RECEIVED_ACTIVATION_EMAIL,
  })
  status: string;
}
