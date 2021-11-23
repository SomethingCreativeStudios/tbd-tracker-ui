import io, * as SocketIOClient from 'socket.io-client';
import { CreateSubGroupDTO } from '~/types/sub-group/dto/CreateSubGroupDTO';
import { UpdateSubGroupDTO } from '~/types/sub-group/dto/UpdateSubGroupDTO';
import { SubGroup } from '~/types/sub-group/sub-group.model';

class SubGroupService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(`${window.location.hostname}:${process.env.VUE_APP_WEBSOCKET_PORT}` + '/subgroup', {
      transports: ['websocket'],
    });
  }

  async create(createModel: CreateSubGroupDTO): Promise<SubGroup> {
    return new Promise((resolve) => {
      this.socket.emit('create', createModel, resolve);
    });
  }

  async findBySeries(seriesId: number): Promise<SubGroup[]> {
    return new Promise((resolve) => {
      this.socket.emit('find-by-series', seriesId, resolve);
    });
  }

  async update(updateModel: UpdateSubGroupDTO): Promise<SubGroup> {
    return new Promise((resolve) => {
      this.socket.emit('update', updateModel, resolve);
    });
  }

  async remove(id: number): Promise<SubGroup> {
    return new Promise((resolve) => {
      this.socket.emit('remove', id, resolve);
    });
  }

  async findSubgroupNames(): Promise<string[]> {
    return new Promise((resolve) => {
      this.socket.emit('subgroup-names', {}, resolve);
    });
  }
}

const service = new SubGroupService();

Object.freeze(service);

export { service };
