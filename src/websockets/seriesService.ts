import { Anime, WatchingStatus } from '@/models/anime';
import { SeasonName } from '@/models/season';
import { AnimeModule } from '@/store/modules/anime';
import io from 'socket.io-client';
import { PartialDeep } from 'type-fest';

import getEnv from '~/utils/env';
import { CreateBySeasonDTO } from './dto/CreateBySeasonDTO';
import { CreateFromMalDTO } from './dto/CreateFromMalDTO';
import { MalSearchDTO } from './dto/MalSearchDTO';
import { SearchBySeasonDTO } from './dto/SearchBySeasonDTO';
import { UpdateSeriesDTO } from './dto/UpdateSeriesDTO';

class SeriesService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/series');
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
         this.socket.emit('get', searchModel, resolve);
      });
   }

   async searchMAL(seriesName: string): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('mal/search-name', seriesName, resolve);
      });
   }

   async searchMALBySeason(searchModel: MalSearchDTO): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('mal/search-season', searchModel, resolve);
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

   async folderNames(): Promise<string[]> {
      return new Promise(resolve => {
         this.socket.emit('folder-names', {}, resolve);
      });
   }

   private async loadSeries() {
      await this.ensureConnection();
      AnimeModule?.setFolderNames(await this.folderNames());
   }
}

const service = new SeriesService();

Object.freeze(service);

export { service };
