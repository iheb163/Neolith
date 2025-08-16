// src/localite/dto/create-localite.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SiteType } from '../localite.entity';

export class CreateLocaliteDto {
  @IsEnum(SiteType)
  site: SiteType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  superficie?: number;

  @IsNotEmpty()
  @IsString()
  ville: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  code_postal?: number;

  @IsNotEmpty()
  @IsString()
  adresse: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;
}
