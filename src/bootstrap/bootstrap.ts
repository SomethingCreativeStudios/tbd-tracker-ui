import { fetchSettings } from '@/compositions/settings';
import { SeasonName } from '@/models/season';
import { Settings, SettingType } from '@/models/settings';
import io from 'socket.io-client';

import { fetchSeries, fetchSubgroupNames, fetchAnimeFolders } from '~/compositions/series/series';
import { AnimeModule } from '~modules/anime';
import { SettingsModule } from '~modules/settings';
import { AppModule } from '~modules/app';
import { DownloadModule } from '~modules/download';
import { MessageModule } from '~modules/message';

declare global {
   interface Window {
      tbaSocket: any;
   }
}

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

async function loadAnime() {
   AnimeModule.addShows(await fetchSeries());
   AnimeModule.setSubgroupNames(await fetchSubgroupNames());
   AnimeModule.setFolderNames(await fetchAnimeFolders());
   AnimeModule.sortShows('Queue');

   window.tbaSocket.on('queue-update', ({ show }) => {
      AnimeModule.updateShowQueue({ showId: show.id, count: show.downloaded, nyaaItems: show.showQueue });
      AnimeModule.updateShowSyncing({ showId: show.id, isSyncing: false });
      AnimeModule.sortShows('Queue');
   });

   window.tbaSocket.on('queue-syncing', ({ show }) => {
      AnimeModule.updateShowSyncing({ showId: show.id, isSyncing: true });
   });

   window.tbaSocket.on('queue-noupdate', ({ show }) => {
      AnimeModule.updateShowSyncing({ showId: show.id, isSyncing: false });
   });
}

async function setWebsocket() {
   window.tbaSocket = io(process.env.VUE_APP_WEBSOCKET_PATH);

   window.tbaSocket.on('connect', function() {
      console.log('Connected');
   });

   window.tbaSocket.on('exception', function(data) {
      MessageModule.setMessage('Error occured connecting to websocket');
      console.error('event', data);
   });

   window.tbaSocket.on('disconnect', function() {
      console.log('Disconnected');
   });
}

async function setUpDownloads() {
   window.tbaSocket.on('start-downloading', function({ hash }) {
      DownloadModule.addItem(hash);
   });

   window.tbaSocket.on('metadata', function({ hash, value }) {
      MessageModule.setMessage(`${value.name} added to download queue`);
      DownloadModule.updateName({ hash, name: value.name });
   });

   window.tbaSocket.on('downloading', function({ hash, value }) {
      DownloadModule.updateProgress({
         hash,
         name: value.name,
         progress: value.progress,
         timeLeft: value.timeLeft,
         speed: value.speed,
         totalDownloaded: value.totalDownloaded,
      });
   });

   window.tbaSocket.on('downloaded', function({ hash, value }) {
      const { name } = DownloadModule.items.find(show => show.hash === hash);
      MessageModule.setMessage(`${name} has downloaded`);
      DownloadModule.removeItem(hash);
   });
}

async function loadSettings() {
   const settings = await fetchSettings();

   SettingsModule.setCurrentSeason(mapSetting('currentSeason', settings, SeasonName.FALL));
   SettingsModule.setCurrentYear(mapSetting('currentYear', settings, 2020));
   SettingsModule.setDefaultSubgroup(mapSetting('defaultSubgroup', settings, 'Erai-raws'));
}

export async function bootstrap() {
   AppModule.setView('anime');
   setWebsocket();
   await loadAnime();
   await loadSettings();
   await setUpDownloads();
}
