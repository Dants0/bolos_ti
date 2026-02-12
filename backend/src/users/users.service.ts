import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find()
    }

    async create(name: string, photo?: string): Promise<User> {
        const user = this.usersRepository.create({ name, photo });
        return this.usersRepository.save(user);
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id })
        if (!user) {
            throw new Error("Usuário não encontrado!")
        }
        return user
    }

    async delete(id: number): Promise<void> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }
        await this.usersRepository.remove(user);
    }

    async update(id: number, name?: string, photo?: string): Promise<User> {
        const user = await this.findOne(id);
        if (name) user.name = name;
        if (photo) user.photo = photo;
        return this.usersRepository.save(user);
    }

}