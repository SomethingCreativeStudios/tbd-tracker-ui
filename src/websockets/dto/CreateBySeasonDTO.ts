import { SeasonName } from '@/models/season';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateBySeasonDTO {
  @IsEnum(SeasonName)
  seasonName: SeasonName;

  @IsNumber()
  seasonYear: number;

  @IsString()
  @Type(() => Number)
  malIds: number[];
}
