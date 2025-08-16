import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/entities/user.entity'; // chemin correct vers ton entity User

export enum SiteType {
  AGENCE = 'agence',
  IMMEUBLE = 'immeuble',
  SIEGE = 'siege',
}

@Entity()
export class Localite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SiteType })
  site: SiteType;

  @Column({ type: 'double precision', nullable: true })
  superficie?: number;

  @Column()
  ville: string;

  @Column({ type: 'int', nullable: true })
  code_postal?: number;

  @Column()
  adresse: string;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  // ---------- relation vers User ----------
  @Column({ type: 'int', nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.localites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
