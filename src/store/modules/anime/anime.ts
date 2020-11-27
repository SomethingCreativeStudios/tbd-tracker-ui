// initial state
import Vue from 'vue';
import { mergeDeepRight, uniq, update } from 'ramda';
import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';

import { Anime, NyaaItem, WatchingStatus } from '~/models/anime';
import {
   addSubgroup,
   updateSeries,
   removeSubgroup,
   updateSubgroup,
   removeSubgroupRule,
   updateSubgroupRule,
   addSubgroupRule,
   removeSeries,
   removeManySeries,
   updateWatchStatus,
} from '~/compositions/series/series';

import store from '~/store';
import { PartialDeep } from 'type-fest';
import { SubGroup } from '~/models/subgroup';
import { RuleType, SubGroupRule } from '@/models/subgroupRule';

function mergeSubgroups(groups: SubGroup[] = [], group: PartialDeep<SubGroup>, groupId: number) {
   const hasGroup = groups.find(({ id }) => id === groupId);

   if (!hasGroup) {
      return groups.concat(group as SubGroup);
   }

   return groups.map(oldGroup => (oldGroup.id === groupId ? mergeDeepRight(oldGroup, group) : oldGroup));
}

function mergeRule(groups: SubGroup[], groupId: number, rule: PartialDeep<SubGroupRule>, ruleId: number) {
   return groups.map(oldGroup => {
      if (oldGroup.id !== groupId) return oldGroup;

      const hasRule = (oldGroup?.rules ?? []).filter(({ id }) => id === ruleId);

      if (!hasRule || hasRule?.length === 0) {
         return { ...oldGroup, rules: (oldGroup?.rules ?? []).concat(rule as SubGroupRule) };
      }

      return { ...oldGroup, rules: (oldGroup?.rules ?? []).map(oldRule => (oldRule.id === ruleId ? mergeDeepRight(oldRule, rule) : oldRule)) };
   });
}

function removeRule(groups: SubGroup[], groupId: number, ruleId: number) {
   return groups.map(oldGroup => {
      if (oldGroup.id !== groupId) return oldGroup;

      const hasRule = (oldGroup?.rules ?? []).filter(({ id }) => id === ruleId);

      if (!hasRule) {
         return oldGroup;
      }

      return { ...oldGroup, rules: (oldGroup?.rules ?? []).filter(oldRule => oldRule.id !== ruleId) };
   });
}

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
   private mutateAddShows(shows: Anime[]) {
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
   private mutateUpdateShowById({ id, newShow }: { id: number; newShow: PartialDeep<Anime> }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? mergeDeepRight(show, newShow) : show))
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
   private mutateUpdateSubgroup({ id, subgroupId, newGroup }: { id: number; subgroupId: number; newGroup: PartialDeep<SubGroup> }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? { ...show, subgroups: mergeSubgroups(show.subgroups, newGroup, subgroupId) } : show))
      );
   }

   @Mutation
   private mutateRemoveSubgroup({ id, subgroupId }: { id: number; subgroupId: number }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? { ...show, subgroups: show.subgroups.filter(group => group.id !== subgroupId) } : show))
      );
   }

   @Mutation
   private mutateUpdateSubgroupRule({
      id,
      subgroupId,
      ruleId,
      newRule,
   }: {
      id: number;
      subgroupId: number;
      ruleId: number;
      newRule: PartialDeep<SubGroupRule>;
   }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? { ...show, subgroups: mergeRule(show.subgroups, subgroupId, newRule, ruleId) } : show))
      );
   }

   @Mutation
   private mutateRemoveSubgroupRule({ id, subgroupId, ruleId }: { id: number; subgroupId: number; ruleId: number }) {
      Vue.set(
         this,
         'shows',
         this.shows.map(show => (show.id === id ? { ...show, subgroups: removeRule(show.subgroups, subgroupId, ruleId) } : show))
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
      this.context.commit('mutateAddShows', []);
   }

   @Action
   public async addShows(shows: Anime[]) {
      this.context.commit(
         'mutateAddShows',
         shows.map(show => ({ ...show, airingData: new Date(show.airingData), score: Number(show.score) }))
      );
   }

   @Action
   public async removeShowById(id: number) {
      await removeSeries(id);
      this.context.commit('mutateRemoveShows', [id]);
   }

   @Action
   public async removeShowByIds(ids: number[]) {
      await removeManySeries(ids);
      this.context.commit('mutateRemoveShows', ids);
   }

   @Action
   public async updateShowById(updateModel: { id: number; newShow: PartialDeep<Anime> }) {
      const foundShow = this.shows.find(show => show.id === updateModel.id);

      await updateSeries(mergeDeepRight(foundShow, updateModel.newShow) as Anime);

      this.context.commit('mutateUpdateShowById', updateModel);
   }

   @Action
   public async updateWatchStatus(id: number) {
      const newStatus = await updateWatchStatus(id);

      this.context.commit('mutateUpdateWatchStatus', { id, status: newStatus });
   }

   @Action
   public async addSubgroup(updateModel: { id: number }) {
      const subgroup = await addSubgroup(updateModel.id);

      this.context.commit('mutateUpdateSubgroup', {
         subgroupId: subgroup.id,
         id: updateModel.id,
         newGroup: subgroup,
      });
   }

   @Action
   public async updateSubgroup(updateModel: { id: number; subgroupId: number; newGroup: PartialDeep<SubGroup> }) {
      const foundShow = this.shows.find(({ id }) => id === updateModel.id);
      const groups = mergeSubgroups(foundShow.subgroups, updateModel.newGroup, updateModel.subgroupId) as SubGroup[];
      const foundGroup = groups.find(({ id }) => id === updateModel.subgroupId);

      await updateSubgroup(foundGroup);

      if (updateModel.newGroup.name) {
         this.context.commit('mutateSubgroupNames', [updateModel.newGroup.name]);
      }
      this.context.commit('mutateUpdateSubgroup', updateModel);
   }

   @Action
   public async removeSubgroup(removeModel: { id: number; subgroupId: number }) {
      await removeSubgroup(removeModel.subgroupId);

      this.context.commit('mutateRemoveSubgroup', removeModel);
   }

   @Action
   public async updateSubgroupRule(updateModel: { id: number; subgroupId: number; ruleId: number; newRule: PartialDeep<SubGroupRule> }) {
      const foundShow = this.shows.find(({ id }) => id === updateModel.id);
      const foundGroup = foundShow.subgroups.find(({ id }) => id === updateModel.subgroupId);
      const foundRule = foundGroup.rules.find(({ id }) => id === updateModel.ruleId);

      await updateSubgroupRule(updateModel.subgroupId, mergeDeepRight(foundRule, updateModel.newRule) as SubGroupRule);

      this.context.commit('mutateUpdateSubgroupRule', updateModel);
   }

   @Action
   public async removeSubgroupRule(removeModel: { id: number; subgroupId: number; ruleId: number }) {
      await removeSubgroupRule(removeModel.ruleId);

      this.context.commit('mutateRemoveSubgroupRule', removeModel);
   }

   @Action
   public async addSubgroupRule(createModel: { id: number; subgroupId: number }) {
      const rule = await addSubgroupRule(createModel.subgroupId);

      this.context.commit('mutateUpdateSubgroupRule', {
         ruleId: rule.id,
         id: createModel.id,
         subgroupId: createModel.subgroupId,
         newRule: rule,
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
      this.context.commit('mutateSortShows', sortBy);
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
