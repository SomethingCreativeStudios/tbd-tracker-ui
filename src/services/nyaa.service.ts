import io, * as SocketIOClient from 'socket.io-client';
import { NyaaItem } from '~/types/nyaa/nyaa-item.model';
import { Series } from '~/types/series/series.model';
import { SubGroup } from '~/types/sub-group/sub-group.model';
import { useSeries, useDownload } from '~/composables';

const { updateSyncStatus, refreshShow } = useSeries();
const { triggerDownload, addToQueue, updateDownload, completeDownload } = useDownload();

class NyaaService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(process.env.VUE_APP_WEBSOCKET_PATH + '/nyaa', {
      transports: ['websocket'],
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
    });

    this.socket.on('torrent-queued', function ({ url, fileName }) {
      console.log('Queued', url, fileName);
      addToQueue(fileName, url);
    });

    this.socket.on('metadata', function ({ hash }) {
      console.log('MetaData', hash);
    });

    this.socket.on('downloading', function ({ hash, value }) {
      updateDownload({ hash, value });
    });

    this.socket.on('downloaded', function ({ hash }) {
      completeDownload(hash);
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
