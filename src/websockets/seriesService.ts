import { Anime, WatchingStatus } from '@/models/anime';
import { AnimeModule } from '@/store/modules/anime';
import io, * as SocketIOClient from 'socket.io-client';

import getEnv from '~/utils/env';
import { CreateBySeasonDTO } from './dto/CreateBySeasonDTO';
import { CreateFromMalDTO } from './dto/CreateFromMalDTO';
import { SearchBySeasonDTO } from './dto/SearchBySeasonDTO';
import { UpdateSeriesDTO } from './dto/UpdateSeriesDTO';

class SeriesService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/series', { transports: ['websocket'] });
      this.loadSeries();
   }

   async ensureConnection() {
      return new Promise(resolve => {
         this.socket.on('connect', () => {
            console.log('connected');
            resolve(true);
         });

         if (this.socket.connected) {
            resolve(true);
         }
      });
   }

   async createByMal(createModel: CreateFromMalDTO): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('create-mal', createModel, resolve);
      });
   }

   async createSeason(createModel: CreateBySeasonDTO): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('create-season', createModel, resolve);
      });
   }

   async fetchAll(searchModel: SearchBySeasonDTO): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('find-by-season', searchModel, resolve);
      });
   }

   async update(updateModel: UpdateSeriesDTO): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('update', updateModel, resolve);
      });
   }

   async updateWatchStatus(id: number): Promise<WatchingStatus> {
      return new Promise(resolve => {
         this.socket.emit('toggle-watch-status', id, resolve);
      });
   }

   async remove(id: number): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('remove', id, resolve);
      });
   }

   async getFolderNames(): Promise<string[]> {
      return new Promise(resolve => {
         this.socket.emit('folder-names', {}, resolve);
      });
   }

   async syncWithMal(id: number): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('sync-mal', id, resolve);
      });
   }

   async syncImageUrl(id: number): Promise<string> {
      return new Promise(resolve => {
         this.socket.emit('sync-mal-image', id, resolve);
      });
   }

   private async loadSeries() {
      await this.ensureConnection();
      AnimeModule?.setFolderNames(await this.getFolderNames());
   }
}

const service = new SeriesService();

Object.freeze(service);

export { service };
