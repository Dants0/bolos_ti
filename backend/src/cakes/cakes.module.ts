import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CakesService } from './cakes.service';
import { CakesController } from './cakes.controller';
import { CakeDebt } from './entities/cake-debt.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CakeDebt]), UsersModule],
  providers: [CakesService],
  controllers: [CakesController],
})
export class CakesModule {}