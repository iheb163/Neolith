// src/consommation/consommation.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consommation } from './consommation.entity';
import { CreateConsommationDto } from './dto/create-consommation.dto';
import { Localite } from '../localite/localite.entity';
import { Mesure } from '../mesure/mesure.entity';

@Injectable()
export class ConsommationService {
  constructor(
    @InjectRepository(Consommation)
    private readonly repo: Repository<Consommation>,

    @InjectRepository(Localite)
    private readonly localiteRepo: Repository<Localite>,

    @InjectRepository(Mesure)
    private readonly mesureRepo: Repository<Mesure>,
  ) {}

  /**
   * Crée une consommation (vérifie que localite et mesure existent).
   * Calcule et stocke `resultat = releve * prixunit` côté serveur.
   * Optionnel : vérifie que la localite appartient à userId si fourni.
   */
  async create(dto: CreateConsommationDto, userId?: number): Promise<Consommation> {
    const local = await this.localiteRepo.findOne({ where: { id: dto.localiteId } });
    if (!local) throw new NotFoundException('Localité introuvable');

    // si tu veux garantir que l'utilisateur possède la localité :
    if (userId && (local as any).userId && (local as any).userId !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas créer une consommation pour cette localité');
    }

    const mesure = await this.mesureRepo.findOne({ where: { id: dto.mesureId } });
    if (!mesure) throw new NotFoundException('Mesure introuvable');

    // Récupère le prix unitaire depuis la mesure et vérifie
    const prixUnitRaw = (mesure as any).prixunit;
    const prixUnit = prixUnitRaw !== undefined && prixUnitRaw !== null ? Number(prixUnitRaw) : NaN;
    if (isNaN(prixUnit)) {
      throw new BadRequestException('Prix unitaire de la mesure invalide ou manquant');
    }

    const releveNum = Number(dto.releve);
    if (isNaN(releveNum)) {
      throw new BadRequestException('Relevé invalide');
    }

    const resultat = releveNum * prixUnit;

    const entity = this.repo.create({
      releve: releveNum,
      resultat,
      localite: local,
      mesure: mesure,
    });

    return this.repo.save(entity);
  }

  /**
   * Liste des consommations pour un utilisateur (filtre via localite.userId si fourni).
   */
  async findAllForUser(userId?: number): Promise<Consommation[]> {
    if (!userId) {
      // toutes les consommations (ou on peut limiter)
      return this.repo.find({ relations: ['localite', 'mesure'] });
    }
    // récupérer les consommations dont la localite.userId = userId
    return this.repo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.localite', 'localite')
      .leftJoinAndSelect('c.mesure', 'mesure')
      .where('localite.userId = :userId', { userId })
      .getMany();
  }
}
