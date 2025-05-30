import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/users/entities/user.entity";


@Entity()
export class CakeDebt{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User, (user)=> user.cakeDebts)
    user: User;

    @Column()
    reason: string;

    @Column()
    date: Date;

    @Column({default: 'pending'})
    status: 'pending' | 'paid';

}