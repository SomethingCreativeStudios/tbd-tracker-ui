import { SeasonName } from '@/models/season';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
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
