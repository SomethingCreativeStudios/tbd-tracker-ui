import { SettingType } from '@/models/settings';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindSettingDTO {
  @IsString()
  @IsOptional()
  key?: string;

  @IsEnum(SettingType)
  @IsOptional()
  type?: string;
}
