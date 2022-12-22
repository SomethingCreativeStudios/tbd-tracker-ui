import { SubGroup } from '../sub-group/sub-group.model';
import { RuleType } from './rule-type.enum';

export class SubGroupRule {
   id: number;

   text: string;

   ruleType: RuleType;

   isPositive: boolean;

   subGroup: SubGroup;
}
