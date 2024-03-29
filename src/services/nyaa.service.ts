import io from 'socket.io-client';
import { Notify } from 'quasar';
import { NyaaItem } from '~/types/nyaa/nyaa-item.model';
import { Series } from '~/types/series/series.model';
import { SubGroup } from '~/types/sub-group/sub-group.model';
import { useSeries, useDownload, useSetting } from '~/composables';
import { BaseService } from './base.service';

const { updateSyncStatus, refreshShow } = useSeries();
const { triggerDownload, addToQueue, updateDownload, completeDownload } = useDownload();
const { buildIO } = useSetting();

class NyaaService extends BaseService {

  constructor() {
    super();

    this.socket = io(buildIO('/nyaa'), {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('accessToken') }
    });

    this.socket.on('series-syncing', ({ id, type }: { id: number; type: 'STARTING' | 'UPDATE_FOUND' | 'NO_UPDATE'; queue: NyaaItem[] }) => {
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
    });

    this.socket.on('start-downloading', function ({ hash, value }) {
      triggerDownload({ hash, value });
      Notify.create({ type: 'info', message: `Downloading ${value.name as string}`, position: 'bottom-right', progress: true });
    });

    this.socket.on('torrent-queued', function ({ url, fileName }) {
      console.log('Queued', url, fileName);
      Notify.create({ type: 'info', message: `Queued ${fileName as string}`, position: 'bottom-right', progress: true });
      addToQueue(fileName, url);
    });

    this.socket.on('metadata', function ({ hash }) {
      console.log('MetaData', hash);
    });

    this.socket.on('downloading', function ({ hash, value }) {
      updateDownload({ hash, value });
    });

    this.socket.on('downloaded', function ({ hash, name }) {
      completeDownload(hash);
      Notify.create({ type: 'positive', message: `Downloaded ${name as string}`, position: 'bottom-right', progress: true });
    });
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

  async testDownload(): Promise<Series> {
    return new Promise((resolve) => {
      this.socket.emit('test-download', {}, resolve);
    });
  }

  async suggestSubgroups(name: string, altNames: string[]): Promise<SubGroup[]> {
    return new Promise((resolve) => {
      this.socket.emit('suggest-subgroups', { showName: name, altNames }, resolve);
    });
  }
}

const service = new NyaaService();

Object.freeze(service);

export { service };
