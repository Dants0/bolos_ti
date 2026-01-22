import { Controller, Get, Post, Put, Param, Body, UnauthorizedException, Delete } from '@nestjs/common';
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
  async create(@Body() body: { userId: number; reason: string; date: Date, passKey: string, dateOcorrido: Date, dsReason?: string }) {

    if (body.passKey !== '5bb2992b4e4744b6b34cb62ab02ee2203bb2992b4e4744b6b34cb62ab02ee220') {
      throw new UnauthorizedException({
        code: 400,
        message: "Senha incorreta"
      });
    }

    return this.cakesService.create(body.userId, body.reason, body.date, body.dateOcorrido, body.dsReason);
  }

  @Put(':id/pay')
  async markAsPaid(@Param('id') id: string) {
    return this.cakesService.markAsPaid(+id);
  }

  @Get('/pay')
  async findCakesPaid() {
    return this.cakesService.findUsersPaidCakes();
  }

  @Get('/allpay')
  async findAllPaidCakes() {
    return this.cakesService.findAllPaidCakes();
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

  @Delete(':id/cake')
  async deleteCake(@Param('id') id: string) {
    return this.cakesService.deleteCake(+id);
  }

  @Put(':id')
  async updateCake(
    @Param('id') id: string,
    @Body() body: { userId?: number; reason?: string; date?: Date; dateOcorrido?: Date; passKey: string; dsReason?: string }
  ) {
    if (body.passKey !== '5bb2992b4e4744b6b34cb62ab02ee2203bb2992b4e4744b6b34cb62ab02ee220') {
      throw new UnauthorizedException({
        code: 400,
        message: 'Senha incorreta'
      });
    }

    return this.cakesService.updateCake(+id, body);
  }

  @Get('/top-paid')
  async getTopPaidUsers() {
    return this.cakesService.findTopPaidUsers();
  }
}