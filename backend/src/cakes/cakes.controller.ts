import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { CakesService } from './cakes.service';

@Controller('cakes')
export class CakesController {
  constructor(private readonly cakesService: CakesService) {}

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
}