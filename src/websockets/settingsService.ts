import { SeasonName } from '@/models/season';
import { Settings, SettingType } from '@/models/settings';
import { AnimeModule } from '@/store/modules/anime';
import { SettingsModule } from '@/store/modules/settings';
import { service as SeriesService } from '~/websockets/seriesService';

import io from 'socket.io-client';

import getEnv from '~/utils/env';

function mapSetting(key: string, settings: Settings[], fallback: any) {
   const foundSetting = settings.find(setting => setting.key == key);

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
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/settings');

      this.socket.on('connect', this.loadSettings.bind(this));
   }

   async fetchSettings(): Promise<Settings[]> {
      return new Promise(resolve => {
         this.socket.emit('fetch', {}, resolve);
      });
   }

   async setSettings(key: string, value: any): Promise<Settings[]> {
      return new Promise(resolve => {
         this.socket.emit('update', { key, value }, resolve);
      });
   }

   private async loadSettings() {
      const settings = await this.fetchSettings();

      await SettingsModule.setCurrentSeason(mapSetting('currentSeason', settings, SeasonName.FALL));
      await SettingsModule.setCurrentYear(mapSetting('currentYear', settings, 2020));
      await SettingsModule.setDefaultSubgroup(mapSetting('defaultSubgroup', settings, 'Erai-raws'));

      AnimeModule.addShows({ shows: await SeriesService.fetchAll('QUEUE', SettingsModule.currentSeason, SettingsModule.currentYear) });
   }
}

const service = new SettingsService();

Object.freeze(service);

export { service };
