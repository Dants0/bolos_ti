import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    create(body: {
        name: string;
        email: string;
    }, photo?: Express.Multer.File): Promise<import("./entities/user.entity").User>;
}
