import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/users/entities/user.entity";


@Entity()
export class CakeDebt {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.cakeDebts, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    reason: string;

    @Column({ nullable: true })
    dsReason: string;

    @Column()
    date: Date;

    @Column()
    dateOcorrido: Date;

    @Column({ default: 'pending' })
    status: 'pending' | 'paid';

    @Column({ nullable: true })
    paidAt: Date;
}