import io from 'socket.io-client';
import { NyaaItem } from '~/types/nyaa/nyaa-item.model';
import { Series } from '~/types/series/series.model';
import { SubGroup } from '~/types/sub-group/sub-group.model';
import { useSeries, useSetting } from '~/composables';
import { BaseService } from './base.service';

const { buildIO } = useSetting();
class NyaaService extends BaseService {
  constructor() {
    super('nyaa');

    this.socket = io(buildIO('/nyaa'), {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('accessToken') },
    });

    this.socket.on(
      'series-syncing',
      ({ id, type, queue }: { id: number; type: 'STARTING' | 'UPDATE_FOUND' | 'PENDING' | 'NO_UPDATE'; queue: NyaaItem[] }) => {
        const { updateSyncStatus, updatePendingStatus, refreshShow } = useSeries();

        if (type === 'STARTING') {
          updateSyncStatus(id, true);
        }

        if (type === 'UPDATE_FOUND') {
          updateSyncStatus(id, false);
          refreshShow(id);
        }

        if (type === 'NO_UPDATE') {
          updateSyncStatus(id, false);
        }

        if (type === 'PENDING') {
          updatePendingStatus(id, queue.length > 0);
        }
      }
    );
  }

  async syncShow(id?: number, season?: string, year?: number): Promise<Series> {
    return new Promise((resolve) => {
      this.socket.emit('sync', { id, season, year }, resolve);
    });
  }

  async download(seriesId: number, url: string, name: string): Promise<Series> {
    return new Promise((resolve) => {
      this.socket.emit('download', { seriesId, url, name }, resolve);
    });
  }

  async suggestSubgroups(name: string, altNames: string[]): Promise<SubGroup[]> {
    return new Promise((resolve) => {
      this.socket.emit('suggest-subgroups', { showName: name, altNames }, resolve);
    });
  }

  async ignoreItem(link: string) {
    return new Promise((resolve) => {
      this.socket.emit('ignore', { link }, resolve);
    });
  }

  async unignoreItem(link: string) {
    return new Promise((resolve) => {
      this.socket.emit('unignore', { link }, resolve);
    });
  }

  async fetchIgnoreLinks(): Promise<string[]> {
    return new Promise((resolve) => {
      this.socket.emit('ignore-links', {}, resolve);
    });
  }
}

const service = new NyaaService();

Object.freeze(service);

export { service };
