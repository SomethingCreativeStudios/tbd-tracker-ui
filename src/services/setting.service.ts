import io, * as SocketIOClient from 'socket.io-client';
import { UpdateSettingDTO } from '~/types/settings/dto/UpdateSettingDTO';
import { SettingType } from '~/types/settings/setting-type.enum';
import { Settings } from '~/types/settings/setting.model';

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

class SettingsService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(`${window.location.hostname}:${process.env.VUE_APP_WEBSOCKET_PORT}` + '/settings', { transports: ['websocket'] });

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
