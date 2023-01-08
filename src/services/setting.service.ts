import io from 'socket.io-client';
import { UpdateSettingDTO } from '~/types/settings/dto/UpdateSettingDTO';
import { SettingType } from '~/types/settings/setting-type.enum';
import { Settings } from '~/types/settings/setting.model';
import { useSetting } from '~/composables/useSettings';
import { BaseService } from './base.service';

const { buildIO } = useSetting();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

class SettingsService extends BaseService {

  constructor() {
    super('setting');

    this.socket = io(buildIO('/settings'), { transports: ['websocket'], auth: { token: localStorage.getItem('accessToken') } });
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
