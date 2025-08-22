// src/localite/localite.service.ts
import { Injectable, NotFoundException, ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localite } from './localite.entity';
import { CreateLocaliteDto } from './dto/create-localite.dto';
import { UpdateLocaliteDto } from './dto/update-localite.dto';

@Injectable()
export class LocaliteService {
  constructor(
    @InjectRepository(Localite)
    private readonly repo: Repository<Localite>,
  ) {}

  /**
   * Crée une localité et rattache userId.
   * Vérifie l'unicité du `code` et du `local` si fournis.
   */
  async create(dto: CreateLocaliteDto, userId: number): Promise<Localite> {
    // vérif unicité 'local' côté applicatif
    if (dto.local) {
      const existsLocal = await this.repo.findOne({ where: { local: dto.local } });
      if (existsLocal) {
        throw new ConflictException('Le champ local est déjà utilisé.');
      }
    }

    // vérif unicité 'code' existante
    if (dto.code !== undefined && dto.code !== null) {
      const existsCode = await this.repo.findOne({ where: { code: dto.code } });
      if (existsCode) {
        throw new ConflictException('Le code fourni est déjà utilisé.');
      }
    }

    const entity = this.repo.create({ ...dto, userId });
    try {
      return await this.repo.save(entity);
    } catch (err: any) {
      // gestion d'erreur de contrainte unique venant de la DB (ex: insertion concurrente)
      // Postgres error code for unique violation is '23505'
      if (err?.code === '23505') {
        // essayer de deviner quel champ a échoué (message PG contient souvent le nom de l'index/colonne)
        throw new ConflictException('Conflit : valeur déjà utilisée (unicité).');
      }
      // sinon renvoyer une erreur serveur générique (pour debug tu peux logger err)
      throw new InternalServerErrorException('Erreur lors de la création de la localité.');
    }
  }

  /**
   * Retourne la liste des localités appartenant à userId.
   */
  async findAllForUser(userId: number): Promise<Localite[]> {
    if (!userId) return [];
    return this.repo.find({ where: { userId } });
  }

  /**
   * Retourne une localité par id appartenant à userId, sinon NotFound.
   */
  async findOneForUser(id: number, userId: number): Promise<Localite> {
    const e = await this.repo.findOne({ where: { id, userId } });
    if (!e) throw new NotFoundException('Localité non trouvée ou non autorisée.');
    return e;
  }

  /**
   * Met à jour une localité après vérification d'appartenance.
   * Vérifie unicité du code et du local si changement.
   */
  async updateForUser(id: number, dto: UpdateLocaliteDto, userId: number): Promise<Localite> {
    const entity = await this.findOneForUser(id, userId); // lance NotFound si absent

    // si on met à jour le 'local', vérifier unicité (autoriser la valeur actuelle)
    if (dto.local !== undefined && dto.local !== null && dto.local !== entity.local) {
      const otherLocal = await this.repo.findOne({ where: { local: dto.local } });
      if (otherLocal && otherLocal.id !== id) {
        throw new ConflictException('Le champ local est déjà utilisé par une autre localité.');
      }
    }

    // si on met à jour le code, vérifier unicité (autoriser la valeur actuelle)
    if (dto.code !== undefined && dto.code !== null && dto.code !== entity.code) {
      const other = await this.repo.findOne({ where: { code: dto.code } });
      if (other && other.id !== id) {
        throw new ConflictException('Le code fourni est déjà utilisé par une autre localité.');
      }
    }

    Object.assign(entity, dto);

    try {
      return await this.repo.save(entity);
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Conflit : valeur déjà utilisée (unicité).');
      }
      throw new InternalServerErrorException('Erreur lors de la mise à jour de la localité.');
    }
  }

  /**
   * Supprime une localité après vérification d'appartenance.
   */
  async removeForUser(id: number, userId: number): Promise<void> {
    const entity = await this.findOneForUser(id, userId); // lance NotFound si absent
    await this.repo.remove(entity);
    return;
  }
}
