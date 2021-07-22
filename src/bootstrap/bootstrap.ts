import { AppModule } from '~modules/app';
import { service as SettingsService } from '~/websockets/settingsService';

async function waitFor(time: number) {
   return new Promise(resolve => {
      setTimeout(() => {
         resolve(true);
      }, time);
   });
}

export async function bootstrap() {
   AppModule.setView('anime');

   await SettingsService.fetchSettings();
}
