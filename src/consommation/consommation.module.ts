import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consommation } from './consommation.entity';
import { ConsommationService } from './consommation.service';
import { ConsommationController } from './consommation.controller';
import { Localite } from '../localite/localite.entity';
import { Mesure } from '../mesure/mesure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consommation, Localite, Mesure])],
  controllers: [ConsommationController],
  providers: [ConsommationService],
  exports: [ConsommationService],
})
export class ConsommationModule {}
