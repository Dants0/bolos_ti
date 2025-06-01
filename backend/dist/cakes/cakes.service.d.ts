import { Repository } from "typeorm";
import { CakeDebt } from "./entities/cake-debt.entity";
import { UsersService } from "src/users/users.service";
export declare class CakesService {
    private cakesRepository;
    private usersService;
    constructor(cakesRepository: Repository<CakeDebt>, usersService: UsersService);
    create(userId: number, reason: string, date: Date): Promise<CakeDebt>;
    findAll(): Promise<CakeDebt[]>;
    markAsPaid(id: number): Promise<CakeDebt>;
    findByUserId(userId: number): Promise<CakeDebt[]>;
    findUsersPaidCakes(): Promise<CakeDebt[]>;
    findUsersMaxPendingCakes(): Promise<{
        userId: number;
        userName: string;
        pendingCount: number;
    }[]>;
}
