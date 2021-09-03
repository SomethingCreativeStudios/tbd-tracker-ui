import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { NyaaFeed } from '../nyaa-feed.model';

export class SearchNyaaDTO {
  @IsString()
  search: string;

  @IsEnum(NyaaFeed)
  feed: NyaaFeed;

  @IsBoolean()
  trusted: boolean;
}
