import { SubGroup } from './subgroup';

export interface SubGroupRule {
   id: number;

   text: string;

   ruleType: RuleType;

   isPositive: boolean;

   subGroup: SubGroup;
}


export enum RuleType {
    CONTAINS = 'contains',
    STARTS_WITH = 'starts with',
    ENDS_WITH = 'ends with',
    REGEX = 'regex',
    BLANK = 'blank',
  }
  