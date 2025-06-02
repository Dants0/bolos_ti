import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
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
  async create(@Body() body: { userId: number; reason: string; date: string }) {
    return this.cakesService.create(body.userId, body.reason, new Date(body.date));
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
    console.log(result);
    return { data: result }; // Wrap in data for consistency
  }

  @Get('/max-paid')
  async findCakesMaxPaid() {
    const result = await this.cakesService.findUsersMaxPaidCakes();
    console.log(result);
    return { data: result };
  }
}