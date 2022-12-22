import { Series } from '../series/series.model';
import { SubGroupRule } from '../sub-group-rule/sub-group-rule.model';

export class SubGroup {
   id: number;

   name: string;

   preferedResultion: '720' | '1080' | '480';

   rules: SubGroupRule[];

   series: Series;
}
