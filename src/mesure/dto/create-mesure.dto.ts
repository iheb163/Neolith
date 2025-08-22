// src/mesure/dto/create-mesure.dto.ts
import { IsNotEmpty, IsIn, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMesureDto {
  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsNotEmpty()
  @IsIn(['I', 'R'])
  type: string;

  @IsNotEmpty()
  @IsIn(['kwh', 'm3'])
  unite: string;

  // optionnel côté validation (envoi un nombre)
  @IsOptional()
  @IsNumber()
  prixunit?: number;
}
