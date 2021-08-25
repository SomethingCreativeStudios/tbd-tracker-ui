// initial state
import Vue from 'vue';
import { uniq } from 'ramda';
import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';

import { Anime, WatchingStatus } from '~/models/anime';

import store from '~/store';
import { UpdateSeriesDTO } from '@/websockets/dto/UpdateSeriesDTO';
import { service as SeriesService } from '~/websockets/seriesService';
import { IdSearch } from '@/models/ultil';
import { CreateBySeasonDTO } from '@/websockets/dto/CreateBySeasonDTO';

@Module({ namespaced: true, name: 'anime', dynamic: true, store })
class AnimeModule extends VuexModule {
   public shows: Anime[] = [];
   public selectedShows: number[] = [];
   public selectMode: string = 'single';
   public folderNames: string[] = [];

   @Mutation
   private mut_setFolderNames(names: string[]) {
      Vue.set(this, 'folderNames', names);
   }

   @Mutation
   private mut_setAnime(anime: Anime[]) {
      Vue.set(
         this,
         'shows',
         anime.map(show => ({ ...show, airingData: new Date(show.airingData), score: Number(show.score) }))
      );
   }

   @Mutation
   private mut_addAnime(anime: Anime[]) {
      Vue.set(this, 'shows', this.shows.concat(anime.map(show => ({ ...show, airingData: new Date(show.airingData), score: Number(show.score) }))));
   }

   @Mutation
   private mut_updateWatchStatus({ id, item }: IdSearch<WatchingStatus>) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? { ...show, watchStatus: item } : show))
      );
   }

   @Mutation
   private mut_updateById({ id, item }: IdSearch<Anime>) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? { ...show, ...item } : show))
      );
   }

   @Mutation
   private mut_removeById(id: number) {
      Vue.set(
         this,
         'shows',
         this.shows.filter(show => show.id !== id)
      );
   }

   @Action
   public setAnime(anime: Anime[]) {
      this.context.commit('mut_setAnime', anime);
   }

   @Action
   public addAnime(anime: Anime[]) {
      this.context.commit('mut_addAnime', anime);
   }

   @Action
   public async updateAnime(updateModel: UpdateSeriesDTO) {
      const anime = await SeriesService.update(updateModel);
      this.context.commit('mut_updateById', { id: anime.id, item: anime } as IdSearch<Anime>);
   }

   @Action
   public async toggleWatchStatus(id: number) {
      const newWatchStatus = await SeriesService.updateWatchStatus(id);
      this.context.commit('mut_updateWatchStatus', { id, item: newWatchStatus } as IdSearch<WatchingStatus>);
   }

   @Action
   public async updateLocalSeries(id: number, anime: Partial<Anime>) {
      this.context.commit('mut_updateById', { id, item: anime } as IdSearch<Anime>);
   }

   @Action
   public async syncWithMAL(id: number) {
      const updateItem = await SeriesService.syncWithMal(id);
      this.context.commit('mut_updateById', { id, item: updateItem } as IdSearch<Anime>);
   }

   @Action
   public async syncImage(id: number) {
      const imageUrl = await SeriesService.syncImageUrl(id);
      this.context.commit('mut_updateById', { id, item: { imageUrl } } as IdSearch<Anime>);
   }

   @Action
   public async createBySeason(createModel: CreateBySeasonDTO) {
      const anime = await SeriesService.createSeason(createModel);

      this.context.commit('mut_addAnime', anime);
   }

   @Action
   public async removeAnime(id: number) {
      await SeriesService.remove(id);

      this.context.commit('mut_removeById', id);
   }

   @MutationAction({ mutate: ['folderNames'] })
   public async setFolderNames(names: string[]) {
      return { folderNames: names };
   }

   @MutationAction({ mutate: ['selectedShows'] })
   public async setSelected(ids: number[]) {
      return { selectedShows: ids };
   }

   @MutationAction({ mutate: ['selectedShows'] })
   public async selectAll() {
      // @ts-ignore
      return { selectedShows: this.state.shows.map(({ id }) => id) };
   }

   @MutationAction({ mutate: ['selectMode'] })
   public async setSelectMode(mode: string) {
      return { selectMode: mode };
   }

   get show() {
      return (id: number) => {
         return this.shows.find(show => show.id === id);
      };
   }
}

export default getModule(AnimeModule);
