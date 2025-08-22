// src/mesure/mesure.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Consommation } from '../consommation/consommation.entity';

@Entity()
export class Mesure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  designation: string;

  // 'I' ou 'R'
  @Column({ type: 'varchar', length: 1 })
  type: string;

  // 'kwh' ou 'm3'
  @Column({ type: 'varchar', length: 10 })
  unite: string;

  // prix unitaire — nombre (nullable pour compatibilité)
  @Column({ type: 'double precision', nullable: true })
  prixunit?: number;
}
