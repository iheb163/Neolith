// src/consommation/consommation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Localite } from '../localite/localite.entity';
import { Mesure } from '../mesure/mesure.entity';

@Entity()
export class Consommation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision' })
  releve: number;

  // nouveau : montant/resultat calculé = releve * prixunit
  @Column({ type: 'double precision' })
  resultat: number;

  @ManyToOne(() => Localite, (localite) => (localite as any).consommations, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'localiteId' })
  localite: Localite;

  @ManyToOne(() => Mesure, (mesure) => (mesure as any).consommations, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'mesureId' })
  mesure: Mesure;
}
