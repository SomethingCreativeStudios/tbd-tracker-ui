import { SeasonName } from '@/models/season';
import { SubGroup } from '@/models/subgroup';
import { SubGroupRule } from '@/models/subgroupRule';
import { PartialDeep } from 'type-fest';
import axios from '~/axios/axios';
import { AnimeModule } from '~modules/anime';
import { Anime, WatchingStatus } from '~/models/anime';

export enum NyaaFeed {
   ANIME = 'https://nyaa.si/?page=rss&c=1_2',
   BOOKS = 'https://nyaa.si/?page=rss&c=3_1',
   MUSIC = 'https://nyaa.si/?page=rss&c=2_2&f=0',
}

export async function fetchSeries(): Promise<Anime[]> {
   const series = await axios.get('/series');

   return series.data;
}

export async function fetchSubgroupNames(): Promise<string[]> {
   const names = await axios.get('/subgroup/names');

   return names.data;
}

export async function searchNyaa(showName: string, trusted: boolean, feed: NyaaFeed): Promise<string[]> {
   const names = await axios.get('/nyaa/feed/query', { params: { search: showName, trusted, feed } });

   return names.data;
}

export async function syncShows() {
   return axios.put('/nyaa/feed/sync');
}

export async function downloadShow(url: string, seriesId: number) {
   return axios.post('/nyaa/download', { seriesId, url });
}

export async function syncShow(id: number) {
   AnimeModule.updateShowSyncing({ showId: id, isSyncing: true });
   return axios.put(`/nyaa/feed/sync/${id}`);
}

export async function fetchAnimeFolders(): Promise<string[]> {
   const names = await axios.get('/anime-folder');

   return names.data;
}

export async function createNewFolder(seriesId: number, folderName?: string) {
   const folder = await axios.post('/anime-folder/' + seriesId, { folderName });

   return folder.data;
}

export async function createFromSeason(year: number, season: SeasonName): Promise<Anime[]> {
   const series = await axios.post(`/season/mal/${year}/${season}`, { autoMatchFolders: true });

   return series.data;
}

export async function createFromId(id: number): Promise<Anime> {
   const series = await axios.post(`/series/mal/${id}`, { autoMatchFolders: true });

   return series.data;
}

export async function updateSeries(series: PartialDeep<Anime>): Promise<Anime> {
   const response = await axios.put('/series', series);
   return response.data;
}

export async function updateWatchStatus(id: number): Promise<WatchingStatus> {
   const response = await axios.put(`/series/watchstatus/${id}`);
   return response.data;
}

export async function removeSeries(seriesId: number) {
   await axios.delete(`/series/${seriesId}`);
}

export async function removeManySeries(seriesIds: number[]) {
   await axios.delete(`/series/all/${seriesIds.join(',')}`);
}

export async function copySubgroup(seriesId: number, others: number[]): Promise<Anime[]> {
   const response = await axios.put(`/series/copy/subgroup/${seriesId}`, others);
   return response.data;
}

export async function addSubgroup(seriesId: number): Promise<SubGroup> {
   const response = await axios.post(`/series/subgroup/${seriesId}`);
   return response.data;
}

export async function updateSubgroup(subgroup: SubGroup): Promise<SubGroup> {
   const response = await axios.put(`/series/subgroup`, subgroup);
   return response.data;
}

export async function removeSubgroup(subgroupId: number) {
   await axios.delete(`/series/subgroup/${subgroupId}`);
}

export async function addSubgroupRule(subgroupId: number): Promise<SubGroupRule> {
   const response = await axios.post(`/subgroup/add/rule/${subgroupId}`);

   return response.data;
}

export async function removeSubgroupRule(ruleId: number) {
   await axios.delete(`/subgroup/rule/${ruleId}`);
}

export async function updateSubgroupRule(subgroupId: number, rule: SubGroupRule) {
   await axios.put(`/subgroup/rule/${subgroupId}`, rule);
}
/**
 
return [
      {
         name: 'Spice and Wolf',
         airingData: new Date(),
         continuing: false,
         description: `Spice and Wolf's story revolves around Kraft Lawrence, a 25-year-old traveling merchant who peddles various goods from town to town to make a living in a stylized, fictional world, with a historical setting with European influences.[6] His main goal in life is to gather enough money to start his own shop, and he already has been traveling for seven years while gaining experience in the trade. One night when stopped at the town of Pasloe, he finds in his wagon a wolf-deity named Holo who is over 600 years old. She takes the form of a 15-year-old girl, except for a wolf's tail and ears. She introduces herself as the town's goddess of harvest, who has kept it blessed with good harvests of wheat for many years. Holo has experienced increasing isolation and disillusionment at the townpeople's move away from her protection towards their own methods of increasing the harvest. She is especially hurt at their forgetting of the promise made between her and a farmer when she arrived in the village and their criticism of her as a "fickle god" for needing to replenish the soil with smaller harvests. Because of these changes, she wants to go back to her homeland in the north called Yoitsu; she believes the people have already forsaken her and that she has kept her promise to maintain the good harvests. Holo also wants to travel to see how the world has changed while she has remained in one place for many years. She manages to bargain her way out of the village by making a deal with Lawrence to take her with him. As they travel, her wisdom helps increase his profits, but at the same time, her true nature draws unwanted attention from the Church.`,
         downloaded: 2,
         folderPath: '/path/to',
         genres: ['Spice', 'Wolf'],
         id: 0,
         imageUrl: 'https://cdn.myanimelist.net/images/anime/5/59401.jpg?s=1c81971daf350f8e99fe00fe3bbd0f95',
         numberOfEpisodes: 12,
         otherNames: ['Ookami to Koushinryou', 'Fox and Salt'],
         score: 10,
         studio: 'Imagin',
         tags: ['Spice', 'Wolf'],
         watchStatus: WatchingStatus.WATCHED,
         subgroups: [
            {
               id: 0,
               name: 'Commie',
               preferedResultion: '720',
               series: null,
               rules: [
                  {
                     id: 0,
                     isPositive: true,
                     text: 'spice and wolf',
                     subGroup: null,
                     ruleType: RuleType.STARTS_WITH,
                  },
                  {
                     id: 1,
                     isPositive: true,
                     text: 'ookami to',
                     subGroup: null,
                     ruleType: RuleType.CONTAINS,
                  },
               ],
            },
         ],
         season: {
            id: 0,
            name: SeasonName.WINTER,
            overallScore: 0,
            year: 2008,
            series: null,
         },
      },
   ];
 */
