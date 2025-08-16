// src/localite/localite.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localite } from './localite.entity';
import { LocaliteService } from './localite.service';
import { LocaliteController } from './localite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Localite])],
  controllers: [LocaliteController],
  providers: [LocaliteService],
  exports: [LocaliteService],
})
export class LocaliteModule {}
