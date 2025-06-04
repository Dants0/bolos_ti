import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CakesModule } from './cakes/cakes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo do banco
      host: 'localhost', // Ou o host do seu serviço (ex.: 'db.supabase.co')
      // host: '192.168.0.190', // Ou o host do seu serviço (ex.: 'db.supabase.co')
      port: 5432, // Porta padrão do PostgreSQL
      username: 'meu_usuario', // Seu usuário
      password: 'minha_senha', // Sua senha
      database: 'bolos', // Nome do banco
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Caminho para as entidades
      synchronize: true, // Sincroniza o schema automaticamente (use apenas em desenvolvimento)
    }),
    UsersModule,
    CakesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
