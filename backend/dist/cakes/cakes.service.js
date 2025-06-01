"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CakesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cake_debt_entity_1 = require("./entities/cake-debt.entity");
const users_service_1 = require("../users/users.service");
let CakesService = class CakesService {
    cakesRepository;
    usersService;
    constructor(cakesRepository, usersService) {
        this.cakesRepository = cakesRepository;
        this.usersService = usersService;
    }
    async create(userId, reason, date) {
        const user = await this.usersService.findOne(userId);
        if (!user)
            throw new Error("Usuário não encontrado");
        const cakeDebt = this.cakesRepository.create({ user, reason, date });
        return this.cakesRepository.save(cakeDebt);
    }
    async findAll() {
        return this.cakesRepository.find({ relations: ['user'] });
    }
    async markAsPaid(id) {
        const cakeDebt = await this.cakesRepository.findOneBy({ id });
        if (!cakeDebt)
            throw new Error("Dívida não encontrada");
        cakeDebt.status = 'paid';
        return this.cakesRepository.save(cakeDebt);
    }
    async findByUserId(userId) {
        const user = await this.usersService.findOne(userId);
        const cakeDebts = await this.cakesRepository.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ['user']
        });
        if (!user) {
            throw new Error("Usuário não possui bólos!");
        }
        return cakeDebts;
    }
    async findUsersPaidCakes() {
        const user = await this.usersService.findAll();
        const cakeDebts = await this.cakesRepository.find({
            where: {
                status: "paid"
            },
            relations: ['user']
        });
        if (!user) {
            throw new Error("Usuário não possui bólos!");
        }
        return cakeDebts;
    }
};
exports.CakesService = CakesService;
exports.CakesService = CakesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cake_debt_entity_1.CakeDebt)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], CakesService);
//# sourceMappingURL=cakes.service.js.map