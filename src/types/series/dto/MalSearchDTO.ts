import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SeasonName } from '../../season/season-name.enum';

export class MalSearchDTO {
  @IsEnum(SeasonName)
  @IsOptional()
  season?: SeasonName;

  @IsNumber()
  @IsOptional()
  year?: number;
}
