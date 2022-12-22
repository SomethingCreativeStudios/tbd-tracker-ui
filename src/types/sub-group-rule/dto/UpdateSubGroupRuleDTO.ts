import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RuleType } from '../rule-type.enum';

export class UpdateSubGroupRuleDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsEnum(RuleType)
  @IsOptional()
  ruleType?: RuleType;

  @IsBoolean()
  @IsOptional()
  isPositive?: boolean;
}
