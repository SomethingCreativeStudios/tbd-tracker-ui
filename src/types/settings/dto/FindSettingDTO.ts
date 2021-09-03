import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SettingType } from '../../settings/setting-type.enum';

export class FindSettingDTO {
  @IsString()
  @IsOptional()
  key?: string;

  @IsEnum(SettingType)
  @IsOptional()
  type?: string;
}
