import io from 'socket.io-client';
import { MalSearchDTO } from '~/types/series/dto/MalSearchDTO';
import { Series } from '~/types/series/series.model';
import { useSetting } from '~/composables/useSettings';
import { BaseService } from './base.service';

const { buildIO } = useSetting();
class QueryService extends BaseService {

  constructor() {
    super('query');

    this.socket = io(buildIO('/series'), { transports: ['websocket'], auth: { token: localStorage.getItem('accessToken') } });
  }

  async ensureConnection() {
    return new Promise((resolve) => {
      this.socket.on('connect', () => {
        console.log('connected');
        resolve(true);
      });

      if (this.socket.connected) {
        resolve(true);
      }
    });
  }

  async searchByName(name: string): Promise<Series[]> {
    return new Promise((resolve) => {
      this.socket.emit('mal/search-name', name, resolve);
    });
  }

  async searchBySeason(searchModel: MalSearchDTO): Promise<Series[]> {
    return new Promise((resolve) => {
      this.socket.emit('mal/search-season', searchModel, resolve);
    });
  }
}

const service = new QueryService();

Object.freeze(service);

export { service };
