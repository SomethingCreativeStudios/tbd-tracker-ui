import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SeasonName } from '../season-name.enum';

export class MalSearchDTO {
  @IsEnum(SeasonName)
  @IsOptional()
  season?: SeasonName;

  @IsNumber()
  @IsOptional()
  year?: number;
}
