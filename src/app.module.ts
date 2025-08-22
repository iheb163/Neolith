// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LocaliteModule } from './localite/localite.module'; // <-- Ajout
import { MesureModule } from './mesure/mesure.module';
import { ConsommationModule } from './consommation/consommation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgrespwd',
      database: 'firstnest',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    LocaliteModule,
    MesureModule,
    ConsommationModule, // <-- Ajout
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
