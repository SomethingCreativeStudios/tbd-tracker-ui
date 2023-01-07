import io from 'socket.io-client';
import { useSetting } from '~/composables';
import { LibraryType } from '~/types/plex/plex.model';
import { BaseService } from './base.service';

const { buildIO } = useSetting();

class PlexService extends BaseService {
  constructor() {
    super();

    this.socket = io(buildIO('/plex'), {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('accessToken') },
    });
  }

  async sync(type: LibraryType) {
    return new Promise((resolve) => {
      this.socket.emit('sync', type, resolve);
    });
  }
}

const service = new PlexService();

Object.freeze(service);

export { service };
