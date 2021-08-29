import io, * as SocketIOClient from 'socket.io-client';
import { Series } from '~/types/series/series.model';
import { CreateSubGroupRuleDTO } from '~/types/sub-group-rule/dto/CreateSubGroupRuleDTO';
import { UpdateSubGroupRuleDTO } from '~/types/sub-group-rule/dto/UpdateSubGroupRuleDTO';
import { SubGroupRule } from '~/types/sub-group-rule/sub-group-rule.model';

class SubGroupRuleService {
   private socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io(import.meta.env.VITE_APP_WEBSOCKET_PATH + '/subgrouprule', { transports: ['websocket'] });
   }

   async create(createModel: CreateSubGroupRuleDTO): Promise<SubGroupRule[]> {
      return new Promise((resolve) => {
         this.socket.emit('create-many', createModel, resolve);
      });
   }

   async update(updateModel: UpdateSubGroupRuleDTO): Promise<SubGroupRule> {
      return new Promise((resolve) => {
         this.socket.emit('update', updateModel, resolve);
      });
   }

   async remove(ruleId: number): Promise<Series> {
      return new Promise((resolve) => {
         this.socket.emit('delete', ruleId, resolve);
      });
   }
}

const service = new SubGroupRuleService();

Object.freeze(service);

export { service };
