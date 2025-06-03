import { CakeDebt } from "src/cakes/entities/cake-debt.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true }) // Pode ser nulo se o usuário não enviar foto
    photo: string;

    @OneToMany(() => CakeDebt, (cakeDebt) => cakeDebt.user)
    cakeDebts: CakeDebt[];

}