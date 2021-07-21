import { SortBy } from '@/models/anime';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchBySeasonDTO {
   @IsOptional()
   @IsNumber()
   year?: number;

   @IsOptional()
   @IsString()
   season?: string;

   @IsOptional()
   @IsEnum(SortBy)
   sortBy?: SortBy;
}
