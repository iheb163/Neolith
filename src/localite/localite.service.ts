// src/localite/localite.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localite } from './localite.entity';
import { CreateLocaliteDto } from './dto/create-localite.dto';

@Injectable()
export class LocaliteService {
  constructor(
    @InjectRepository(Localite)
    private repo: Repository<Localite>,
  ) {}

  async create(dto: CreateLocaliteDto, userId: number) {
    const entity = this.repo.create({ ...dto, userId });
    // debug : log avant sauvegarde
    console.log('[localite.service] create entity =', entity);
    return this.repo.save(entity);
  }

  async findAllForUser(userId: number) {
    if (!userId) return [];
    return this.repo.find({ where: { userId } });
  }

  async findOneForUser(id: number, userId: number) {
    const e = await this.repo.findOne({ where: { id, userId } });
    if (!e) throw new NotFoundException('Localité non trouvée ou non autorisée');
    return e;
  }

  async removeForUser(id: number, userId: number) {
    const e = await this.findOneForUser(id, userId);
    return this.repo.remove(e);
  }
}
