// initial state

import { SubGroup } from '@/models/subgroup';
import { IdSearch } from '@/models/ultil';
import { CreateSubGroupDTO } from '@/websockets/dto/CreateSubGroupDTO';
import { UpdateSubGroupDTO } from '@/websockets/dto/UpdateSubGroupDTO';
import Vue from 'vue';
import { VuexModule, Module, getModule, MutationAction, Action, Mutation } from 'vuex-module-decorators';

import store from '~/store';
import { service as SubgroupService } from '~/websockets/subgroupService';

@Module({ namespaced: true, name: 'subgroup', dynamic: true, store })
class SubgroupModule extends VuexModule {
   public subgroups: { [key: number]: SubGroup[] };

   @Mutation
   private mut_createSubgroup({ id: seriesId, item }: IdSearch<SubGroup>) {
      Vue.set(this, 'subgroups', { ...this.subgroups, [seriesId]: (this.subgroups?.[seriesId] ?? []).concat(item) });
   }

   @Mutation
   private mut_updateSubgroup({ id: seriesId, item }: IdSearch<SubGroup>) {
      const currentItems = this.subgroups?.[seriesId] ?? [item];
      Vue.set(this, 'subgroups', { ...this.subgroups, [seriesId]: currentItems.map(group => (group.id === item.id ? item : group)) });
   }

   @Mutation
   private mut_removeSubgroup(id: number) {
      Vue.set(
         this,
         'subgroups',
         Object.entries(this.subgroups).reduce((acc, [seriesId, groups]) => {
            return { ...acc, [seriesId]: groups.filter(group => group.id !== id) };
         }, {} as { [key: number]: SubGroup[] })
      );
   }

   @Action
   public async createSubgroup(createModel: CreateSubGroupDTO) {
      const subgroup = await SubgroupService.create(createModel);

      this.context.commit('mut_createSubgroup', { id: subgroup.series.id, item: subgroup } as IdSearch<SubGroup>);
   }

   @Action
   public async updateSubgroup(updateModel: UpdateSubGroupDTO) {
      const subgroup = await SubgroupService.update(updateModel);

      this.context.commit('mut_updateSubgroup', { id: subgroup.series.id, item: subgroup } as IdSearch<SubGroup>);
   }

   @Action
   public async removeSubgroup(id: number) {
      await SubgroupService.remove(id);

      this.context.commit('mut_removeSubgroup', id);
   }
}

export default getModule(SubgroupModule);
