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
import getEnv from '~/utils/env';

import { service as SettingsService } from '~/websockets/settingsService';

export async function bootstrap() {
   AppModule.setView('anime');

   const test = await SettingsService.fetchSettings();
}
