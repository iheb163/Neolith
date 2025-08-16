import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LocaliteService } from './localite.service';
import { CreateLocaliteDto } from './dto/create-localite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('localites')
export class LocaliteController {
  constructor(private readonly localiteService: LocaliteService) {}

  // Création : besoin d'être connecté
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateLocaliteDto) {
    // req.user.sub contient l'id de l'utilisateur (payload sub)
    return this.localiteService.create(dto, req.user.sub);
  }

  // Récupère les localités de l'utilisateur connecté
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllForUser(@Request() req) {
    const userId = req.user.sub;
    return this.localiteService.findAllForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.localiteService.findOneForUser(+id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.localiteService.removeForUser(+id, userId);
  }
}
