import io, * as SocketIOClient from 'socket.io-client';
import { NyaaItem } from '~/types/nyaa/nyaa-item.model';
import { Series } from '~/types/series/series.model';
import { SubGroup } from '~/types/sub-group/sub-group.model';
import { useSeriesStore } from '~/stores/series';
import { useDownloadStore } from '~/stores/download';

const seriesStore = useSeriesStore();
const downloadStore = useDownloadStore();

class NyaaService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(import.meta.env.VITE_APP_WEBSOCKET_PATH + '/nyaa', { transports: ['websocket'] });

      this.socket.on('series-syncing', ({ id, type, queue }: { id: number; type: 'STARTING' | 'UPDATE_FOUND' | 'NO_UPDATE'; queue: NyaaItem[] }) => {
         if (type === 'STARTING') {
            seriesStore.updateSyncStatus(id, true);
         }

         if (type === 'UPDATE_FOUND') {
            seriesStore.updateSyncStatus(id, false);
            seriesStore.refreshShow(id);
         }

         if (type === 'NO_UPDATE') {
            seriesStore.updateSyncStatus(id, false);
         }
      });

      this.socket.on('start-downloading', function ({ hash, value }) {
         downloadStore.triggerDownload({ hash, value });
      });

      this.socket.on('torrent-queued', function ({ url, fileName }) {
         console.log('Queued', url, fileName);
         downloadStore.addQueue(fileName, url);
      });

      this.socket.on('metadata', function ({ hash, value }) {
         console.log('MetaData', hash);
      });

      this.socket.on('downloading', function ({ hash, value }) {
         downloadStore.updateDownload({ hash, value });
      });

      this.socket.on('downloaded', function ({ hash, value }) {
         downloadStore.completeDownload(hash);
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
