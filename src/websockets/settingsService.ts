import { SeasonName } from '@/models/season';
import { Settings, SettingType } from '@/models/settings';
import { AnimeModule } from '@/store/modules/anime';
import { SettingsModule } from '@/store/modules/settings';
import { service as SeriesService } from '~/websockets/seriesService';

import io, * as SocketIOClient from 'socket.io-client';

import getEnv from '~/utils/env';
import { UpdateSettingDTO } from './dto/UpdateSettingDTO';
import { SortBy } from '@/models/anime';

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
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/settings', { transports: ['websocket'] });

      this.socket.on('connect', this.loadSettings.bind(this));
   }

   async fetchSettings(): Promise<Settings[]> {
      return new Promise(resolve => {
         this.socket.emit('find', {}, resolve);
      });
   }

   async setSettings(updateModel: UpdateSettingDTO): Promise<Settings> {
      return new Promise(resolve => {
         this.socket.emit('update', updateModel, resolve);
      });
   }

   private async loadSettings() {
      const settings = await this.fetchSettings();

      await SettingsModule.setCurrentSeason(mapSetting('currentSeason', settings, SeasonName.FALL));
      await SettingsModule.setCurrentYear(mapSetting('currentYear', settings, 2020));
      await SettingsModule.setDefaultSubgroup(mapSetting('defaultSubgroup', settings, 'Erai-raws'));

      const anime = await SeriesService.fetchAll({ sortBy: SortBy.QUEUE, season: SettingsModule.currentSeason, year: SettingsModule.currentYear });
      AnimeModule.setAnime(anime);
   }
}

const service = new SettingsService();

Object.freeze(service);

export { service };
