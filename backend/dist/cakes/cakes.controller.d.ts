import { CakesService } from './cakes.service';
export declare class CakesController {
    private readonly cakesService;
    constructor(cakesService: CakesService);
    findAll(): Promise<import("./entities/cake-debt.entity").CakeDebt[]>;
    findByUserId(userId: string): Promise<import("./entities/cake-debt.entity").CakeDebt[]>;
    create(body: {
        userId: number;
        reason: string;
        date: string;
    }): Promise<import("./entities/cake-debt.entity").CakeDebt>;
    markAsPaid(id: string): Promise<import("./entities/cake-debt.entity").CakeDebt>;
    findCakesPaid(): Promise<import("./entities/cake-debt.entity").CakeDebt[]>;
}
