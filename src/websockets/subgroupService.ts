import { Anime } from '@/models/anime';
import { SubGroup } from '@/models/subgroup';
import io from 'socket.io-client';
import { PartialDeep } from 'type-fest';

import getEnv from '~/utils/env';
import { CreateSubGroupDTO } from './dto/CreateSubGroupDTO';
import { UpdateSubGroupDTO } from './dto/UpdateSubGroupDTO';

class SubGroupService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/subgroup');
   }

   async create(createModel: CreateSubGroupDTO): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('create', createModel, resolve);
      });
   }

   async update(updateModel: UpdateSubGroupDTO): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('update', updateModel, resolve);
      });
   }

   async remove(id: number): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('remove', id, resolve);
      });
   }

   async findSubgroupNames(): Promise<string[]> {
      return new Promise(resolve => {
         this.socket.emit('subgroup-names', {}, resolve);
      });
   }
}

const service = new SubGroupService();

Object.freeze(service);

export { service };
