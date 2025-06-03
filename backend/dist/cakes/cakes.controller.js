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
exports.CakesController = void 0;
const common_1 = require("@nestjs/common");
const cakes_service_1 = require("./cakes.service");
let CakesController = class CakesController {
    cakesService;
    constructor(cakesService) {
        this.cakesService = cakesService;
    }
    async findAll() {
        return this.cakesService.findAll();
    }
    async findByUserId(userId) {
        return this.cakesService.findByUserId(+userId);
    }
    async create(body) {
        return this.cakesService.create(body.userId, body.reason, new Date(body.date));
    }
    async markAsPaid(id) {
        return this.cakesService.markAsPaid(+id);
    }
    async findCakesPaid() {
        return this.cakesService.findUsersPaidCakes();
    }
    async findCakesMaxPending() {
        const result = await this.cakesService.findUsersMaxPendingCakes();
        return { data: result };
    }
    async findCakesMaxPaid() {
        const result = await this.cakesService.findUsersMaxPaidCakes();
        return { data: result };
    }
};
exports.CakesController = CakesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CakesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CakesController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CakesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/pay'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CakesController.prototype, "markAsPaid", null);
__decorate([
    (0, common_1.Get)('/pay'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CakesController.prototype, "findCakesPaid", null);
__decorate([
    (0, common_1.Get)('/max-pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CakesController.prototype, "findCakesMaxPending", null);
__decorate([
    (0, common_1.Get)('/max-paid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CakesController.prototype, "findCakesMaxPaid", null);
exports.CakesController = CakesController = __decorate([
    (0, common_1.Controller)('cakes'),
    __metadata("design:paramtypes", [cakes_service_1.CakesService])
], CakesController);
//# sourceMappingURL=cakes.controller.js.map