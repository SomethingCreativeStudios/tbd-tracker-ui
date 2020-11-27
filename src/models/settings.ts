export enum SettingType {
   STRING = 'string',
   NUMBER = 'number',
   BOOLEAN = 'boolean',
}

export class Settings {
   id: number;

   key: string;

   value: string;

   type: SettingType;
}
