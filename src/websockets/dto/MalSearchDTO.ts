import { SeasonName } from '@/models/season';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class MalSearchDTO {
  @IsEnum(SeasonName)
  @IsOptional()
  season?: SeasonName;

  @IsNumber()
  @IsOptional()
  year?: number;
}
