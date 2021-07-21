import { RuleType } from '@/models/subgroupRule';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateRuleDTO {
  @IsString()
  text: string;

  @IsEnum(RuleType)
  ruleType: RuleType;

  @IsBoolean()
  isPositive: boolean;
}

export class CreateSubGroupRuleDTO {
  @IsNumber()
  subgroupId: number;

  @IsArray({ each: true })
  @Type(() => CreateRuleDTO)
  rules: CreateRuleDTO[];
}
