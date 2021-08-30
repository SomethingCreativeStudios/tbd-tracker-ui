import io, * as SocketIOClient from 'socket.io-client';
import { SeasonName } from '~/types/season/season-name.enum';
import { SortBy } from '~/types/series/sort-by.enum';
import { UpdateSettingDTO } from '~/types/settings/dto/UpdateSettingDTO';
import { SettingType } from '~/types/settings/setting-type.enum';
import { Settings } from '~/types/settings/setting.model';

function mapSetting(key: string, settings: Settings[], fallback: any) {
   const foundSetting = settings.find((setting) => setting.key == key);

   if (!foundSetting) {
      return fallback;
   }

   if (foundSetting.type === SettingType.STRING) {
      return String(foundSetting.value);
   }

   if (foundSetting.type === SettingType.BOOLEAN) {
      return Boolean(foundSetting.type);
   }

   if (foundSetting.type === SettingType.NUMBER) {
      return Number(foundSetting.value);
   }
}

class SettingsService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(import.meta.env.VITE_APP_WEBSOCKET_PATH + '/settings', { transports: ['websocket'] });

      this.socket.on('connect', () => {});
   }

   async fetchSettings(): Promise<Settings[]> {
      return new Promise((resolve) => {
         this.socket.emit('search', {}, resolve);
      });
   }

   async setSettings(updateModel: UpdateSettingDTO): Promise<Settings> {
      return new Promise((resolve) => {
         this.socket.emit('update', updateModel, resolve);
      });
   }
}

const service = new SettingsService();

Object.freeze(service);

export { service };
