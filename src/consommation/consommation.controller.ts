import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ConsommationService } from './consommation.service';
import { CreateConsommationDto } from './dto/create-consommation.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('consommations')
export class ConsommationController {
  constructor(private readonly service: ConsommationService) {}

  // création protégée — on récupère user via req.user (payload JWT)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateConsommationDto, @Request() req: any) {
    const userId = req.user?.sub ?? req.user?.id;
    return this.service.create(dto, userId);
  }

  // liste pour l'utilisateur connecté (protégée)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllForUser(@Request() req: any) {
    const userId = req.user?.sub ?? req.user?.id;
    return this.service.findAllForUser(userId);
  }
}
