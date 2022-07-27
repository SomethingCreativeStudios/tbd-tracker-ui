import io, * as SocketIOClient from 'socket.io-client';
import { MalSearchDTO } from '~/types/series/dto/MalSearchDTO';
import { Series } from '~/types/series/series.model';
import { useSetting } from '~/composables/useSettings';

const { buildIO } = useSetting();
class QueryService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(buildIO('/series'), { transports: ['websocket'] });
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
