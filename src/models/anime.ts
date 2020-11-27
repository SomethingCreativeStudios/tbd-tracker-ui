import { Season } from './season';
import { SubGroup } from './subgroup';

export enum WatchingStatus {
   WATCHING = 'watching',
   WATCHED = 'watched',
   THREE_RULE = 'three_rule',
   NOT_WATCHING = 'not_watching',
}

export interface Anime {
   id: number;

   name: string;

   otherNames: string[];

   studio: string;

   folderPath: string;

   description: string;

   imageUrl: string;

   airingData: Date;

   numberOfEpisodes: number;

   downloaded: number;

   score: number;

   genres: string[];

   tags: string[];

   watchStatus: WatchingStatus;

   continuing: boolean;

   season: Season;

   subgroups: SubGroup[];

   showQueue: NyaaItem[];

   isSyncing: boolean;
}

export interface NyaaItem {
   subGroupName: string;
   itemName: string;
   downloadLink: string;
   publishedDate: Date;
   resolution: string;
}
