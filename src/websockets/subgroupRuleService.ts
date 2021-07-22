import { Anime } from '@/models/anime';
import { SubGroup } from '@/models/subgroup';
import { SubGroupRule } from '@/models/subgroupRule';
import io, * as SocketIOClient from 'socket.io-client';
import { PartialDeep } from 'type-fest';

import getEnv from '~/utils/env';
import { CreateSubGroupRuleDTO } from './dto/CreateSubGroupRuleDTO';
import { UpdateSubGroupRuleDTO } from './dto/UpdateSubGroupRuleDTO';

class SubGroupRuleService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/subgrouprule', { transports: ['websocket'] });
   }

   async create(createModel: CreateSubGroupRuleDTO): Promise<SubGroupRule[]> {
      return new Promise(resolve => {
         this.socket.emit('create-many', createModel, resolve);
      });
   }

   async update(updateModel: UpdateSubGroupRuleDTO): Promise<SubGroupRule> {
      return new Promise(resolve => {
         this.socket.emit('update', updateModel, resolve);
      });
   }

   async remove(ruleId: number): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('delete', ruleId, resolve);
      });
   }
}

const service = new SubGroupRuleService();

Object.freeze(service);

export { service };
