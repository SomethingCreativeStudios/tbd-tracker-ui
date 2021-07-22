import { IsBoolean, IsEnum, IsString } from 'class-validator';

export enum NyaaFeed {
   ANIME = 'https://nyaa.si/?page=rss&c=1_2',
   BOOKS = 'https://nyaa.si/?page=rss&c=3_1',
   MUSIC = 'https://nyaa.si/?page=rss&c=2_2&f=0',
}

export class SearchNyaaDTO {
   @IsString()
   search: string;

   @IsEnum(NyaaFeed)
   feed: NyaaFeed;

   @IsBoolean()
   trusted: boolean;
}
