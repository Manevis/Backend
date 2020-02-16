import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity, CreateDateColumn, ManyToOne, UpdateDateColumn, Generated,
} from 'typeorm';
import {User} from "../users/user.entity";
import {PhotoTypeEnum} from "./enum/PhotoType.enum";

@Entity()
export class Photo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    fileName: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: PhotoTypeEnum,
        default: PhotoTypeEnum.POST,
    })
    type: string;

    @ManyToOne(
        type => User,
        user => user.photos,
    )
    user: User;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
