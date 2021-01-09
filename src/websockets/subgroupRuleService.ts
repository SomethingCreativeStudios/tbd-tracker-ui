import { Anime } from '@/models/anime';
import { SubGroup } from '@/models/subgroup';
import { SubGroupRule } from '@/models/subgroupRule';
import io from 'socket.io-client';
import { PartialDeep } from 'type-fest';

import getEnv from '~/utils/env';

class SubGroupRuleService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(getEnv('VUE_APP_WEBSOCKET_PATH') + '/subgrouprule');
   }

   async create(subgroupId: number, rule: PartialDeep<SubGroupRule>): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('create', { subgroupId, rule }, resolve);
      });
   }

   async update(subgroupId: number, rule: PartialDeep<SubGroupRule>): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('update', { subgroupId: subgroupId, rule }, resolve);
      });
   }

   async remove(subgroupId: number, ruleId: number): Promise<Anime> {
      return new Promise(resolve => {
         this.socket.emit('delete', { subgroupId, ruleId }, resolve);
      });
   }
}

const service = new SubGroupRuleService();

Object.freeze(service);

export { service };
