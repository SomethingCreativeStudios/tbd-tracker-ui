import { Anime, NyaaItem } from '@/models/anime';
import { AnimeModule } from '~modules/anime';
import { DownloadModule } from '~modules/download';
import { MessageModule } from '~modules/message';

import io, * as SocketIOClient from 'socket.io-client';

import getEnv from '~/utils/env';
import Subgroup from '@/components/subgroup/subgroup';
import { SubGroup } from '@/models/subgroup';

class NyaaService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/nyaa', { transports: ['websocket'] });

      this.socket.on('series-syncing', ({ id, type, queue }: { id: number; type: 'STARTING' | 'UPDATE_FOUND' | 'NO_UPDATE'; queue: NyaaItem[] }) => {
         if (type === 'STARTING') {
            AnimeModule.updateLocalSeries(id, { isSyncing: true });
         }

         if (type === 'UPDATE_FOUND') {
            AnimeModule.updateLocalSeries(id, { isSyncing: false, downloaded: queue.length, showQueue: queue });
         }

         if (type === 'NO_UPDATE') {
            AnimeModule.updateLocalSeries(id, { isSyncing: false });
         }
      });

      this.socket.on('start-downloading', function({ hash, value }) {
         DownloadModule.addItem({ hash, url: value.url, queued: value.queued });
      });

      this.socket.on('torrent-queued', function({ url, fileName }) {
         console.log('Queued', url, fileName);
         DownloadModule.addQueuedItem({ url, name: fileName });
      });

      this.socket.on('metadata', function({ hash, value }) {
         MessageModule.setMessage(`${value.name} added to download queue`);
         DownloadModule.updateName({ hash, name: value.name });
      });

      this.socket.on('downloading', function({ hash, value }) {
         DownloadModule.updateProgress({
            hash,
            name: value.name,
            progress: value.progress,
            timeLeft: value.timeLeft,
            speed: value.speed,
            totalDownloaded: value.totalDownloaded,
         });
      });

      this.socket.on('downloaded', function({ hash, value }) {
         const { name } = DownloadModule.items.find(show => show.hash === hash);
         MessageModule.setMessage(`${name} has downloaded`);
         DownloadModule.removeItem(hash);
      });
   }

   async syncShow(id?: number, season?: string, year?: number): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('sync', { id, season, year }, resolve);
      });
   }

   async download(seriesId: number, url: string, name: string): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('download', { seriesId, url, name }, resolve);
      });
   }

   async testDownload(): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('test-download', {}, resolve);
      });
   }

   async suggestSubgroups(name: string, altNames: string[]): Promise<SubGroup[]> {
      return new Promise(resolve => {
         this.socket.emit('suggest-subgroups', { showName: name, altNames }, resolve);
      });
   }
}

const service = new NyaaService();

Object.freeze(service);

export { service };
