import { IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CreateConsommationDto {
  @IsNotEmpty()
  @IsInt()
  localiteId: number;

  @IsNotEmpty()
  @IsInt()
  mesureId: number;

  @IsNotEmpty()
  @IsNumber()
  releve: number;
}
