import { IsEnum, IsNumber } from 'class-validator';
import { SeasonName } from '~/types/season/season-name.enum';

export class MigrateSeriesDTO {
  @IsNumber()
  id: number;

  @IsEnum(SeasonName)
  season: SeasonName;

  @IsNumber()
  year: number;
}
