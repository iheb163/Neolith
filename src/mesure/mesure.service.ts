// src/mesure/mesure.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesure } from './mesure.entity';
import { CreateMesureDto } from './dto/create-mesure.dto';
import { UpdateMesureDto } from './dto/update-mesure.dto';

@Injectable()
export class MesureService {
  constructor(
    @InjectRepository(Mesure)
    private readonly repo: Repository<Mesure>,
  ) {}

  create(dto: CreateMesureDto): Promise<Mesure> {
    const m = this.repo.create(dto);
    return this.repo.save(m);
  }

  findAll(): Promise<Mesure[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Mesure> {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Mesure non trouvée');
    return m;
  }

  async update(id: number, dto: UpdateMesureDto): Promise<Mesure> {
    const m = await this.findOne(id);
    Object.assign(m, dto);
    return this.repo.save(m);
  }

  async remove(id: number): Promise<void> {
    const m = await this.findOne(id);
    await this.repo.remove(m);
  }
}
