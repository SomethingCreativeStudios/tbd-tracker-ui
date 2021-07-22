import { Anime } from '@/models/anime';
import getEnv from '~/utils/env';
import { MalSearchDTO } from './dto/MalSearchDTO';
import io, * as SocketIOClient from 'socket.io-client';

class MalQueryService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/series', { transports: ['websocket'] });
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

   async searchByName(name: string): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('mal/search-name', name, resolve);
      });
   }

   async searchBySeason(searchModel: MalSearchDTO): Promise<Anime[]> {
      return new Promise(resolve => {
         this.socket.emit('mal/search-season', searchModel, resolve);
      });
   }
}

const service = new MalQueryService();

Object.freeze(service);

export { service };
