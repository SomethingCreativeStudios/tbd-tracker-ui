import { SeasonName } from './season-name.enum';

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
