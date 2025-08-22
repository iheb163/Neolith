// src/localite/localite.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { OneToMany } from 'typeorm';
import { Consommation } from '../consommation/consommation.entity';

@Entity()
export class Localite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'double precision', nullable: true })
  superficie?: number;

  @Column({ name: 'city', type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'int', nullable: true })
  code?: number;

  @Column({ type: 'int', nullable: true })
  nombre_employes?: number;

  @Column({ type: 'int', nullable: true })
  ref_steg?: number;

  // maps reste optionnel (nullable)
  @Column({ type: 'varchar', length: 500, nullable: true })
  maps?: string;

  @Column({ type: 'varchar', nullable: true })
  adresse?: string;

  
  @Column({ type: 'varchar', length: 255, nullable: false })
  region: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  local: string;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.localites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(() => Consommation, c => c.localite)
  consommations: Consommation[];
}
