import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    create(name: string, email: string): Promise<User>;
    findOne(id: number): Promise<User>;
}
