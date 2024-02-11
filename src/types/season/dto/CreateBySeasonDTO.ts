import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { SeasonName } from '../season-name.enum';

export class CreateBySeasonDTO {
  @IsEnum(SeasonName)
  seasonName: SeasonName;

  @IsNumber()
  seasonYear: number;

  @IsString()
  @Type(() => Number)
  malIds: number[];

  folderMap?: Record<number, string>;
}
