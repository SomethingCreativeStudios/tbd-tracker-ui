import { SettingType } from '@/models/settings';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDTO {
   @IsString()
   key: string;

   @IsString()
   @IsOptional()
   value?: string;

   @IsEnum(SettingType)
   @IsOptional()
   type?: SettingType;
}
