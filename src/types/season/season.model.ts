import { Series } from "../series/series.model";
import { SeasonName } from "./season-name.enum";

export class Season {
   id: number;

   name: SeasonName;

   year: number;

   overallScore: number;

   series: Series[];
}
