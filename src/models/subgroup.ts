import { Anime } from './anime';
import { SubGroupRule } from './subgroupRule';

export interface SubGroup {
   id: number;

   name: string;

   preferedResultion: '720' | '1080' | '480';

   series: Anime;

   rules: SubGroupRule[];
}
