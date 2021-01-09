import { Anime, WatchingStatus } from '@/models/anime';
import { SeasonName } from '@/models/season';
import { AnimeModule } from '@/store/modules/anime';
import io from 'socket.io-client';
import { PartialDeep } from 'type-fest';

import getEnv from '~/utils/env';

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

   async createByMal(malId: number, seasonName: SeasonName, seasonYear: number): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('create-mal', { malId, seasonName, seasonYear }, resolve);
      });
   }

   async createSeason(series: Anime[], seasonName: SeasonName, seasonYear: number): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('create-season', { series, seasonName, seasonYear }, resolve);
      });
   }

   async fetchAll(sortBy: 'QUEUE' | 'NAME' | 'WATCH_STATUS' = 'QUEUE', season?: SeasonName, year?: number): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('get', { sortBy, season, year }, resolve);
      });
   }

   async searchMAL(seriesName: string): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('mal-search', seriesName, resolve);
      });
   }

   async searchMALBySeason(season: SeasonName, year: number): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('season-search', { season, year }, resolve);
      });
   }

   async update(series: PartialDeep<Anime>): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('update', series, resolve);
      });
   }

   async updateWatchStatus(id: number): Promise<WatchingStatus> {
      return new Promise(resolve => {
         this.socket.emit('watch-status', id, resolve);
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
