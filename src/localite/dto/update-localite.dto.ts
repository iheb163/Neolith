// src/localite/dto/update-localite.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateLocaliteDto } from './create-localite.dto';

export class UpdateLocaliteDto extends PartialType(CreateLocaliteDto) {}
