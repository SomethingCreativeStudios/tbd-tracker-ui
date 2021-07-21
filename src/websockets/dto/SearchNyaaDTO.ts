import { NyaaFeed } from '@/compositions/series/series';
import { IsBoolean, IsEnum, IsString } from 'class-validator';

export class SearchNyaaDTO {
   @IsString()
   search: string;

   @IsEnum(NyaaFeed)
   feed: NyaaFeed;

   @IsBoolean()
   trusted: boolean;
}
