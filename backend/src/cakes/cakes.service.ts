import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CakeDebt } from "./entities/cake-debt.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class CakesService {
    constructor(
        @InjectRepository(CakeDebt)
        private cakesRepository: Repository<CakeDebt>,
        private usersService: UsersService,
    ) { }

    async create(userId: number, reason: string, date: Date, dateOcorrido: Date, dsReason?: string): Promise<CakeDebt> {
        const user = await this.usersService.findOne(userId)
        if (!user) throw new NotFoundException("Usuário não encontrado")
        const cakeDebt = this.cakesRepository.create({ user, reason, date, dateOcorrido, dsReason })
        return this.cakesRepository.save(cakeDebt)
    }

    async findAll(): Promise<CakeDebt[]> {
        return this.cakesRepository.find({
            relations: ['user'],
            order: {
                date: "ASC"
            }
        })
    }

    async markAsPaid(id: number): Promise<CakeDebt> {
        const cakeDebt = await this.cakesRepository.findOneBy({ id })
        if (!cakeDebt) throw new NotFoundException("Bólos não encontrada");
        cakeDebt.status = 'paid'
        return this.cakesRepository.save(cakeDebt)
    }

    async deleteCake(id: number): Promise<CakeDebt> {
        const cakeDebt = await this.cakesRepository.findOne({ where: { id } })
        if (!cakeDebt) throw new NotFoundException("Bólos não encontrado");

        return this.cakesRepository.remove(cakeDebt)
    }

    async findByUserId(userId: number): Promise<CakeDebt[]> {
        const user = await this.usersService.findOne(userId)
        const cakeDebts = await this.cakesRepository.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ['user']
        })
        if (!user) {
            throw new Error("Usuário não possui bólos!")
        }
        return cakeDebts
    }

    async findUsersPaidCakes(): Promise<CakeDebt[]> {
        const user = await this.usersService.findAll()
        const cakeDebts = await this.cakesRepository.find({
            where: {
                status: "paid"
            },
            relations: ['user']
        })
        if (!user) {
            throw new Error("Usuário não possui bólos!")
        }
        return cakeDebts
    }

    async findAllPaidCakes(): Promise<CakeDebt[]> {
        const user = await this.usersService.findAll()
        const cakeDebts = await this.cakesRepository.find({
            where: {
                status: "paid"
            },
            relations: ['user']
        })

        return cakeDebts
    }

    async findUsersMaxPendingCakes(): Promise<{ userId: number; userName: string; pendingCount: number, message: string }[]> {
        const result = await this.cakesRepository
            .createQueryBuilder('cake_debt')
            .select('cake_debt.userId', 'userId')
            .addSelect('user.name', 'name')
            .addSelect('COUNT(*)', 'status')
            .innerJoin('cake_debt.user', 'user')
            .where('cake_debt.status = :status', { status: 'pending' })
            .groupBy('cake_debt.userId')
            .addGroupBy('user.name')
            .orderBy('status', 'DESC')
            .getRawMany();

        return result;
    }

    async findUsersMaxPaidCakes(): Promise<{ userId: number; userName: string; paidCount: number }[]> {
        const result = await this.cakesRepository
            .createQueryBuilder('cake_debt')
            .select('cake_debt.userId', 'userId')
            .addSelect('user.name', 'name')
            .addSelect('COUNT(*)', 'status')
            .innerJoin('cake_debt.user', 'user')
            .where('cake_debt.status = :status', { status: 'paid' })
            .groupBy('cake_debt.userId')
            .addGroupBy('user.name')
            .orderBy('status', 'DESC')
            .getRawMany();

        return result;
    }

    async updateCake(
        id: number,
        updateData: { userId?: number; reason?: string; date?: Date; dateOcorrido?: Date; dsReason?: string }
    ): Promise<CakeDebt> {
        const cakeDebt = await this.cakesRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!cakeDebt) {
            throw new NotFoundException('Bólos não encontrado');
        }

        if (updateData.userId && updateData.userId !== cakeDebt.user.id) {
            const newUser = await this.usersService.findOne(updateData.userId);
            if (!newUser) {
                throw new NotFoundException('Usuário não encontrado');
            }
            cakeDebt.user = newUser;
        }

        if (updateData.reason) cakeDebt.reason = updateData.reason;
        if (updateData.dsReason) cakeDebt.dsReason = updateData.dsReason;
        if (updateData.date) cakeDebt.date = updateData.date;
        if (updateData.dateOcorrido) cakeDebt.dateOcorrido = updateData.dateOcorrido;

        return this.cakesRepository.save(cakeDebt);
    }

    async findTopPaidUsers(): Promise<{ userId: number; name: string; paidCount: number; photo: string }[]> {
        const result = await this.cakesRepository
            .createQueryBuilder('cake_debt')
            .select('cake_debt.userId', 'userId')
            .addSelect('user.name', 'name')
            .addSelect('user.photo', 'photo')
            .addSelect('COUNT(*)', 'paidCount')
            .innerJoin('cake_debt.user', 'user')
            .where('cake_debt.status = :status', { status: 'paid' })
            .groupBy('cake_debt.userId')
            .addGroupBy('user.name')
            .addGroupBy('user.photo')
            .orderBy('"paidCount"', 'DESC')
            .limit(3)
            .getRawMany();

        return result;
    }

}