import { User } from "src/users/entities/user.entity";
export declare class CakeDebt {
    id: number;
    user: User;
    reason: string;
    date: Date;
    status: 'pending' | 'paid';
}
