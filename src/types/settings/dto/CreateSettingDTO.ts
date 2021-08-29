import { IsEnum, IsString } from 'class-validator';
import { SettingType } from '../setting-type.enum';

export class CreateSettingDTO {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsEnum(SettingType)
  type: SettingType;
}
