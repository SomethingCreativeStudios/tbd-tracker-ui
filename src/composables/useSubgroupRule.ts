import { reactive, readonly, computed } from 'vue';
import { CreateSubGroupRuleDTO } from '~/types/sub-group-rule/dto/CreateSubGroupRuleDTO';
import { UpdateSubGroupRuleDTO } from '~/types/sub-group-rule/dto/UpdateSubGroupRuleDTO';
import { SubGroupRule } from '~/types/sub-group-rule/sub-group-rule.model';
import { service as SubgroupRuleService } from '../services/sub-group-rule.service';
import { useSubgroup } from './useSubgroup';

const { getSubgroups } = useSubgroup();
const state = reactive({ rules: {} as { [groupId: number]: SubGroupRule[] } });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.state.subgroupRules = state;

async function createRule(createModel: CreateSubGroupRuleDTO) {
  const newRule = await SubgroupRuleService.create(createModel);

  state.rules = {
    ...state.rules,
    [createModel.subgroupId]: (state.rules?.[createModel.subgroupId] ?? []).concat(newRule)
  };
}

async function removeRule(ruleId: number) {
  await SubgroupRuleService.remove(ruleId);

  state.rules = Object.entries(state.rules).reduce((acc, [groupId, rules]) => {
    return { ...acc, [groupId]: rules.filter(rule => rule.id !== ruleId) };
  }, {} as { [key: number]: SubGroupRule[] });
}

async function updateRule(subgroupId: number, updateModel: UpdateSubGroupRuleDTO) {
  const updatedRule = await SubgroupRuleService.update(updateModel);

  const currentItems = state.rules?.[subgroupId] ?? [updatedRule];

  state.rules = {
    ...state.rules,
    [subgroupId]: currentItems.map(rule => (rule.id === updatedRule.id ? updatedRule : rule))
  };
}

async function setUp() {
  state.rules = {};

  const groups = Object.values(getSubgroups.value).reduce((acc, groups) => acc.concat(groups), []);

  for await (const group of groups) {
    state.rules[group.id] = await SubgroupRuleService.findBySubgroup(group.id);
  }
}

export function useSubgroupRule() {
  return {
    setUp,
    createRule,
    removeRule,
    updateRule,
    getSubgroupRules: computed(() => readonly(state.rules))
  };
}
