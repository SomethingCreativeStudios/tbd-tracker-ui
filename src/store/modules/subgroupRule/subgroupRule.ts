// initial state

import { SubGroup } from '@/models/subgroup';
import { SubGroupRule } from '@/models/subgroupRule';
import { IdSearch } from '@/models/ultil';
import { CreateSubGroupDTO } from '@/websockets/dto/CreateSubGroupDTO';
import { CreateSubGroupRuleDTO } from '@/websockets/dto/CreateSubGroupRuleDTO';
import { UpdateSubGroupRuleDTO } from '@/websockets/dto/UpdateSubGroupRuleDTO';
import Vue from 'vue';
import { VuexModule, Module, getModule, Action, Mutation } from 'vuex-module-decorators';

import store from '~/store';
import { service as SubgroupRuleService } from '~/websockets/subgroupRuleService';

@Module({ namespaced: true, name: 'subgroupRule', dynamic: true, store })
class SubgroupRuleModule extends VuexModule {
   public subgroupRules: { [key: number]: SubGroupRule[] };

   @Mutation
   private mut_createSubgroupRule({ id: groupId, item }: IdSearch<SubGroupRule[]>) {
      Vue.set(this, 'subgroupRules', { ...this.subgroupRules, [groupId]: (this.subgroupRules?.[groupId] ?? []).concat(item) });
   }

   @Mutation
   private mut_updateSubgroupRule({ id: groupId, item }: IdSearch<SubGroupRule>) {
      const currentItems = this.subgroupRules?.[groupId] ?? [item];
      Vue.set(this, 'subgroupRules', { ...this.subgroupRules, [groupId]: currentItems.map(rule => (rule.id === item.id ? item : rule)) });
   }

   @Mutation
   private mut_removeSubgroupRule(id: number) {
      Vue.set(
         this,
         'subgroupRules',
         Object.entries(this.subgroupRules).reduce((acc, [groupId, rules]) => {
            return { ...acc, [groupId]: rules.filter(rule => rule.id !== id) };
         }, {} as { [key: number]: SubGroupRule[] })
      );
   }

   @Action
   public async createSubgroupRule(createModel: CreateSubGroupRuleDTO) {
      const rules = await SubgroupRuleService.create(createModel);

      this.context.commit('mut_createSubgroup', { id: createModel.subgroupId, item: rules } as IdSearch<SubGroupRule[]>);
   }

   @Action
   public async updateSubgroupRule(updateModel: UpdateSubGroupRuleDTO) {
      const rule = await SubgroupRuleService.update(updateModel);

      this.context.commit('mut_updateSubgroupRule', { id: rule.subGroup.id, item: rule } as IdSearch<SubGroupRule>);
   }

   @Action
   public async removeSubgroupRule(id: number) {
      await SubgroupRuleService.remove(id);

      this.context.commit('mut_removeSubgroupRule', id);
   }
}

export default getModule(SubgroupRuleModule);
