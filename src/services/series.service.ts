import io, * as SocketIOClient from 'socket.io-client';
import { CreateBySeasonDTO } from '~/types/season/dto/CreateBySeasonDTO';
import { CreateFromMalDTO } from '~/types/season/dto/CreateFromMalDTO';
import { SearchBySeasonDTO } from '~/types/season/dto/SearchBySeasonDTO';
import { UpdateSeriesDTO } from '~/types/season/dto/UpdateSeriesDTO';
import { MigrateSeriesDTO } from '~/types/series/dto/MigrateSeriesDTO';
import { Series } from '~/types/series/series.model';
import { WatchingStatus } from '~/types/series/watching-status.enum';

class SeriesService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(`${window.location.hostname}:${process.env.VUE_APP_WEBSOCKET_PORT}` + '/series', { transports: ['websocket'] });
    this.loadSeries();
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

  async createByMal(createModel: CreateFromMalDTO): Promise<Series> {
    return new Promise((resolve) => {
      this.socket.emit('create-mal', createModel, resolve);
    });
  }

  async createSeason(createModel: CreateBySeasonDTO): Promise<Series[]> {
    return new Promise((resolve) => {
      this.socket.emit('create-season', createModel, resolve);
    });
  }

  async migrateSeries(migrateModel: MigrateSeriesDTO): Promise<Series[]> {
    return new Promise((resolve) => {
      this.socket.emit('migrate-series', migrateModel, resolve);
    });
  }

  async fetchAll(searchModel: SearchBySeasonDTO): Promise<Series[]> {
    return new Promise((resolve) => {
      this.socket.emit('find-by-season', searchModel, resolve);
    });
  }

  async fetchById(id: number): Promise<Series> {
    return new Promise((resolve) => {
      this.socket.emit('get-by-it', id, resolve);
    });
  }

  async update(updateModel: UpdateSeriesDTO): Promise<Series> {
    return new Promise((resolve) => {
      this.socket.emit('update', updateModel, resolve);
    });
  }

  async updateWatchStatus(id: number): Promise<WatchingStatus> {
    return new Promise((resolve) => {
      this.socket.emit('toggle-watch-status', id, resolve);
    });
  }

  async remove(id: number): Promise<Series> {
    return new Promise((resolve) => {
      this.socket.emit('remove', id, resolve);
    });
  }

  async getFolderNames(): Promise<string[]> {
    return new Promise((resolve) => {
      this.socket.emit('folder-names', {}, resolve);
    });
  }

  async syncWithMal(id: number): Promise<Series> {
    return new Promise((resolve) => {
      this.socket.emit('sync-mal', id, resolve);
    });
  }

  async syncImageUrl(id: number): Promise<string> {
    return new Promise((resolve) => {
      this.socket.emit('sync-mal-image', id, resolve);
    });
  }

  private async loadSeries() {
    await this.ensureConnection();
  }
}

const service = new SeriesService();

Object.freeze(service);

export { service };
