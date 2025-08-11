import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  // nouveau : téléphone (nullable si tu veux pas l'obliger)
  @Column({ nullable: true })
  tel?: string;

  // nouveau : date de naissance (type date)
  @Column({ type: 'date', nullable: true })
  date_naissance?: string;
}
