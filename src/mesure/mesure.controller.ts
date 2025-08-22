// src/mesure/mesure.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MesureService } from './mesure.service';
import { CreateMesureDto } from './dto/create-mesure.dto';
import { UpdateMesureDto } from './dto/update-mesure.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // protège toutes les routes (tu peux adapter si besoin)
@Controller('mesures')
export class MesureController {
  constructor(private readonly mesureService: MesureService) {}

  @Post()
  create(@Body() dto: CreateMesureDto) {
    return this.mesureService.create(dto);
  }

  @Get()
  findAll() {
    return this.mesureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mesureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMesureDto) {
    return this.mesureService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mesureService.remove(+id);
  }
}
