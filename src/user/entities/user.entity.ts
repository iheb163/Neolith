import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Localite } from '../../localite/localite.entity'; // adapte le chemin

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  tel?: string;

  @Column({ type: 'date', nullable: true })
  date_naissance?: string;

  // relation : un utilisateur peut avoir plusieurs localités
  @OneToMany(() => Localite, (localite) => localite.user)
  localites?: Localite[];
}
