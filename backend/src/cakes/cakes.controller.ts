import { Controller, Get, Post, Put, Param, Body, UnauthorizedException } from '@nestjs/common';
import { CakesService } from './cakes.service';

@Controller('cakes')
export class CakesController {
  constructor(private readonly cakesService: CakesService) { }

  @Get()
  async findAll() {
    return this.cakesService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.cakesService.findByUserId(+userId);
  }

  @Post()
  async create(@Body() body: { userId: number; reason: string; date: Date, passKey: string }) {

    if (body.passKey !== 'ti@labcmi') {
      throw new UnauthorizedException({
        code: 400,
        message: "Senha incorreta"
      });
    }

    return this.cakesService.create(body.userId, body.reason, body.date);
  }

  @Put(':id/pay')
  async markAsPaid(@Param('id') id: string) {
    return this.cakesService.markAsPaid(+id);
  }

  @Get('/pay')
  async findCakesPaid() {
    return this.cakesService.findUsersPaidCakes();
  }

  @Get('/max-pending')
  async findCakesMaxPending() {
    const result = await this.cakesService.findUsersMaxPendingCakes();
    return { data: result }; // Wrap in data for consistency
  }

  @Get('/max-paid')
  async findCakesMaxPaid() {
    const result = await this.cakesService.findUsersMaxPaidCakes();
    return { data: result };
  }
}