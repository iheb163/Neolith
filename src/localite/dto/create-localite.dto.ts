// src/localite/dto/create-localite.dto.ts
import { IsNotEmpty, IsIn, IsOptional, IsNumber, IsInt, Min, IsString } from 'class-validator';

export class CreateLocaliteDto {
  @IsNotEmpty()
  @IsIn(['agence', 'immeuble', 'siege', 'appartement'])
  type: string;

  @IsOptional()
  @IsNumber()
  superficie?: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  adresse: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  code?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  nombre_employes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ref_steg?: number;

  // maps est optionnel
  @IsOptional()
  @IsString()
  maps?: string;

  // region et local obligatoires (selon ta demande précédente)
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  local: string;
}
