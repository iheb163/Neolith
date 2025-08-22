// src/mesure/mesure.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MesureService } from './mesure.service';
import { MesureController } from './mesure.controller';
import { Mesure } from './mesure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mesure])],
  providers: [MesureService],
  controllers: [MesureController],
  exports: [MesureService],
})
export class MesureModule {}
