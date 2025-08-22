// src/localite/localite.controller.ts
import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request, Patch } from '@nestjs/common';
import { LocaliteService } from './localite.service';
import { CreateLocaliteDto } from './dto/create-localite.dto';
import { UpdateLocaliteDto } from './dto/update-localite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('localites')
export class LocaliteController {
  constructor(private readonly localiteService: LocaliteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateLocaliteDto) {
    const userId = req.user?.sub ?? req.user?.userId ?? req.user?.id;
    return this.localiteService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllForUser(@Request() req) {
    const userId = req.user?.sub ?? req.user?.userId ?? req.user?.id;
    return this.localiteService.findAllForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateLocaliteDto) {
    const userId = req.user?.sub ?? req.user?.userId ?? req.user?.id;
    return this.localiteService.updateForUser(+id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const userId = req.user?.sub ?? req.user?.userId ?? req.user?.id;
    return this.localiteService.removeForUser(+id, userId);
  }
}
