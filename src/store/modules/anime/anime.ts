// initial state
import Vue from 'vue';
import { uniq } from 'ramda';
import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';

import { Anime, NyaaItem, WatchingStatus } from '~/models/anime';

import { service as SeriesService } from '~/websockets/seriesService';

import { service as NyaaService } from '~/websockets/nyaaService';
import { service as SubGroupService } from '~/websockets/subgroupService';
import { service as SubGroupRuleService } from '~/websockets/subgroupRuleService';

import store from '~/store';
import { PartialDeep } from 'type-fest';
import { SubGroup } from '~/models/subgroup';
import { CreateSubGroupRuleDTO } from '@/websockets/dto/CreateSubGroupRuleDTO';
import { UpdateSubGroupRuleDTO } from '@/websockets/dto/UpdateSubGroupRuleDTO';
import { CreateSubGroupDTO } from '@/websockets/dto/CreateSubGroupDTO';
import { UpdateSeriesDTO } from '@/websockets/dto/UpdateSeriesDTO';

function sortShow(sortBy, a, b) {
   if (sortBy === 'Name') {
      if (a.name < b.name) {
         return -1;
      }
      if (a.name > b.name) {
         return 1;
      }
      return 0;
   }

   if (sortBy === 'Queue') {
      return (b.showQueue?.length ?? 0) - (a.showQueue?.length ?? 0);
   }

   if (sortBy === 'Watch Status') {
      if (a.watchStatus < b.watchStatus) {
         return -1;
      }
      if (a.watchStatus > b.watchStatus) {
         return 1;
      }
      return 0;
   }

   return 0;
}

@Module({ namespaced: true, name: 'anime', dynamic: true, store })
class AnimeModule extends VuexModule {
   public shows: Anime[] = [];
   public selectedShows: number[] = [];
   public selectMode: string = 'single';
   public subgroupNames: string[] = [];
   public folderNames: string[] = [];

   @Mutation
   private mutateSubgroupNames(names: string[]) {
      Vue.set(this, 'subgroupNames', uniq(this.subgroupNames.concat(names)));
   }

   @Mutation
   private mutateAddShows({ shows, clear = false }: { shows: Anime[]; clear: boolean }) {
      if (clear) {
         this.shows = [];
      }

      Vue.set(this, 'shows', this.shows.concat(shows));
      Vue.set(this, 'folderNames', uniq(this.folderNames.concat(shows.map(show => show.folderPath))));
   }

   @Mutation
   private mutateSortShows(sortBy: 'Name' | 'Queue' | 'Watch Status') {
      const sortedShows = this.shows.sort((a, b) => sortShow(sortBy, a, b));

      Vue.set(this, 'shows', sortedShows);
   }

   @Mutation
   private mutateRemoveShows(ids: number[]) {
      Vue.set(
         this,
         'shows',
         this.shows.filter(show => !ids.includes(show.id))
      );
   }

   @Mutation
   private mutateUpdateShowById(newShow: Anime) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === newShow.id ? newShow : show))
      );
   }

   @Mutation
   private mutateUpdateWatchStatus({ id, status }: { id: number; status: WatchingStatus }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? { ...show, watchStatus: status } : show))
      );
   }

   @Mutation
   private mutateSuggestedGroups({ id, hasGroups }: { id: number; hasGroups: boolean }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? { ...show, hasPotentialSubgroups: hasGroups } : show))
      );
   }

   @Mutation
   private mutateShowQueue({ showId, nyaaItems, count }: { showId: number; count: number; nyaaItems: NyaaItem[] }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === showId ? { ...show, downloaded: count, showQueue: nyaaItems } : show))
      );
   }

   @Mutation
   private mutateShowSyncing({ showId, isSyncing }: { showId: number; isSyncing: boolean }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === showId ? { ...show, isSyncing } : show))
      );
   }

   @Action
   public async loadShows() {
      this.context.commit('mutateAddShows', { shows: [] });
   }

   @Action
   public async addShows({ shows, clear = false }: { shows: Anime[]; clear?: boolean }) {
      this.context.commit('mutateAddShows', {
         clear,
         shows: shows.map(show => ({ ...show, airingData: new Date(show.airingData), score: Number(show.score) })),
      });
   }

   @Action
   public async removeShowById(id: number) {
      await SeriesService.remove(id);
      this.context.commit('mutateRemoveShows', [id]);
   }

   @Action
   public async removeShowByIds(ids: number[]) {
      for (let index = 0; index < ids.length; index++) {
         await SeriesService.remove(ids[index]);
      }

      this.context.commit('mutateRemoveShows', ids);
   }

   @Action
   public async updateShowById(updateModel: UpdateSeriesDTO) {
      const updatedShow = await SeriesService.update(updateModel);

      this.context.commit('mutateUpdateShowById', { ...updatedShow, airingData: new Date(updatedShow.airingData), score: Number(updatedShow.score) });
   }

   @Action
   public async updateWatchStatus(id: number) {
      const newStatus = await SeriesService.updateWatchStatus(id);

      this.context.commit('mutateUpdateWatchStatus', { id, status: newStatus });
   }

   @Action
   public async findSubgroups(show: Anime) {
      if (show.subgroups.length > 0) {
         return;
      }

      const suggestedGroups = await NyaaService.suggestSubgroups(show.name, show.otherNames);

      this.context.commit('mutateSuggestedGroups', { id: show.id, hasGroups: suggestedGroups.length !== 0 });
   }

   @Action
   public async addSubgroup(createModel: CreateSubGroupDTO) {
      const series = await SubGroupService.create(createModel);

      this.context.commit('mutateUpdateShowById', {
         ...series,
         airingData: new Date(series.airingData),
         score: Number(series.score),
      });
   }

   @Action
   public async updateSubgroup(updateModel: { id: number; subgroupId: number; newGroup: PartialDeep<SubGroup> }) {
      const updatedSeries = await SubGroupService.update({ ...updateModel.newGroup, id: updateModel.subgroupId });

      this.context.commit('mutateUpdateShowById', {
         ...updatedSeries,
         airingData: new Date(updatedSeries.airingData),
         score: Number(updatedSeries.score),
      });
   }

   @Action
   public async removeSubgroup(removeModel: { id: number; subgroupId: number }) {
      const updatedSeries = await SubGroupService.remove(removeModel.subgroupId);

      this.context.commit('mutateUpdateShowById', {
         ...updatedSeries,
         airingData: new Date(updatedSeries.airingData),
         score: Number(updatedSeries.score),
      });
   }

   @Action
   public async updateSubgroupRule(updateModel: UpdateSubGroupRuleDTO) {
      const updatedSeries = await SubGroupRuleService.update(updateModel);

      this.context.commit('mutateUpdateShowById', {
         ...updatedSeries,
         airingData: new Date(updatedSeries.airingData),
         score: Number(updatedSeries.score),
      });
   }

   @Action
   public async removeSubgroupRule(id: number) {
      const updatedSeries = await SubGroupRuleService.remove(id);

      this.context.commit('mutateUpdateShowById', {
         ...updatedSeries,
         airingData: new Date(updatedSeries.airingData),
         score: Number(updatedSeries.score),
      });
   }

   @Action
   public async addSubgroupRule(createModel: CreateSubGroupRuleDTO) {
      const updatedSeries = await SubGroupRuleService.create(createModel);

      this.context.commit('mutateUpdateShowById', {
         ...updatedSeries,
         airingData: new Date(updatedSeries.airingData),
         score: Number(updatedSeries.score),
      });
   }

   @Action
   public async updateShowQueue(queueModel: { showId; count: number; nyaaItems: NyaaItem[] }) {
      this.context.commit('mutateShowQueue', queueModel);
   }

   @Action
   public async updateShowSyncing(queueModel: { showId: number; isSyncing: boolean }) {
      this.context.commit('mutateShowSyncing', queueModel);
   }

   @Action
   public async sortShows(sortBy: 'Name' | 'Queue' | 'Watch Status') {
      //   this.context.commit('mutateSortShows', sortBy);
   }

   @MutationAction({ mutate: ['subgroupNames'] })
   public async setSubgroupNames(names: string[]) {
      return { subgroupNames: names };
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
