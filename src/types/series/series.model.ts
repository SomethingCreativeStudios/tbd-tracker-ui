import { NyaaItem } from '../nyaa/nyaa-item.model';
import { Season } from '../season/season.model';
import { SubGroup } from '../sub-group/sub-group.model';
import { WatchingStatus } from './watching-status.enum';

export class Series {
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

  showName?: string;

  offset?: number;

  continuing: boolean = false;

  malId: number;

  season: Season;

  subgroups: SubGroup[];

  showQueue: NyaaItem[];

  nextAiringDate?: Date;

  episodeRegex?: string;
}
