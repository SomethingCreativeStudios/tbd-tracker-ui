import { acceptHMRUpdate, defineStore } from 'pinia';
import { CreateRuleDTO, CreateSubGroupRuleDTO } from '~/types/sub-group-rule/dto/CreateSubGroupRuleDTO';
import { UpdateSubGroupRuleDTO } from '~/types/sub-group-rule/dto/UpdateSubGroupRuleDTO';
import { SubGroupRule } from '~/types/sub-group-rule/sub-group-rule.model';
import { service as SubgroupRuleService } from '../services/sub-group-rule.service';

export const useSubGroupRule = defineStore('subgroupRule', () => {
   const rules = ref({} as { [groupId: number]: SubGroupRule[] });

   async function createRule(createModel: CreateSubGroupRuleDTO) {
      const newRule = await SubgroupRuleService.create(createModel);

      rules.value = { ...rules, [createModel.subgroupId]: (this.subgroupRules?.[createModel.subgroupId] ?? []).concat(newRule) };
   }

   async function removeRule(ruleId: number) {
      await SubgroupRuleService.remove(ruleId);

      rules.value = Object.entries(rules).reduce((acc, [groupId, rules]) => {
         return { ...acc, [groupId]: rules.filter((rule) => rule.id !== ruleId) };
      }, {} as { [key: number]: SubGroupRule[] });
   }

   async function updateRule(updateModel: UpdateSubGroupRuleDTO) {
      const updatedRule = await SubgroupRuleService.update(updateModel);
      const currentItems = this.subgroupRules?.[updatedRule.subGroup.id] ?? [updatedRule];

      rules.value = { ...rules, [updatedRule.subGroup.id]: currentItems.map((rule) => (rule.id === updatedRule.id ? updatedRule : rule)) };
   }
   return { createRule, removeRule, updateRule };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSubGroupRule, import.meta.hot));
