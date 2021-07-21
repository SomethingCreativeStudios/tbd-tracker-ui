import { SettingType } from '@/models/settings';
import { IsEnum, IsString } from 'class-validator';

export class CreateSettingDTO {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsEnum(SettingType)
  type: SettingType;
}
