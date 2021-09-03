import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SeasonName } from '../season-name.enum';

export class CreateFromMalDTO {
  @IsNumber()
  malId: number;

  @IsNumber()
  seasonYear: number;

  @IsEnum(SeasonName)
  seasonName: SeasonName;

  @IsOptional()
  @IsBoolean()
  autoMatchFolders?: boolean;
}
