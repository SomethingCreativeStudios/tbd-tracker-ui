import { Anime } from '@/models/anime';
import { SubGroup } from '@/models/subgroup';
import io from 'socket.io-client';
import { PartialDeep } from 'type-fest';

import getEnv from '~/utils/env';

class SubGroupService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/subgroup');
   }

   async create(seriesId: number, subgroup: PartialDeep<SubGroup>): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('create', { seriesId, subgroup }, resolve);
      });
   }

   async update(subgroup: PartialDeep<SubGroup>): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('update', subgroup, resolve);
      });
   }

   async remove(id: number): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('remove', id, resolve);
      });
   }
}

const service = new SubGroupService();

Object.freeze(service);

export { service };
