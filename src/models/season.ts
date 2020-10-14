import { Anime } from './anime';

export interface Season {
   id: number;

   name: SeasonName;

   year: number;

   overallScore: number;

   series: Anime[];
}

export enum SeasonName {
   FALL = 'fall',
   WINTER = 'winter',
   SUMMER = 'summer',
   SPRING = 'spring',
}

export function toSeasonName(name: string) {
   if (name === 'fall') {
      return SeasonName.FALL;
   }

   if (name === 'winter') {
      return SeasonName.WINTER;
   }

   if (name === 'summer') {
      return SeasonName.SUMMER;
   }

   if (name === 'spring') {
      return SeasonName.SPRING;
   }

   return SeasonName.FALL;
}
