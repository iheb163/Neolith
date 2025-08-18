// src/localite/localite.controller.ts
import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LocaliteService } from './localite.service';
import { CreateLocaliteDto } from './dto/create-localite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('localites')
export class LocaliteController {
  constructor(private readonly localiteService: LocaliteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() dto: CreateLocaliteDto) {
    // Récupère l'id utilisateur depuis plusieurs champs possibles (sub, userId, id)
    const userId = req.user?.sub ?? req.user?.userId ?? req.user?.id;
    console.log('[localites][POST] req.user =', req.user, '=> userId =', userId);
    if (!userId) {
      // sécurité : si pas d'userId (improbable si guard fonctionne), on peut rejeter
      throw new Error('Utilisateur non identifié (userId manquant)');
    }
    return this.localiteService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllForUser(@Request() req) {
    const userId = req.user?.sub ?? req.user?.userId ?? req.user?.id;
    console.log('[localites][GET] req.user =', req.user, '=> userId =', userId);
    return this.localiteService.findAllForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.sub ?? req.user?.userId ?? req.user?.id;
    return this.localiteService.findOneForUser(+id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const userId = req.user?.sub ?? req.user?.userId ?? req.user?.id;
    return this.localiteService.removeForUser(+id, userId);
  }
}
