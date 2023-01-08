import { CreateSubGroupDTO } from '~/types/sub-group/dto/CreateSubGroupDTO';
import { UpdateSubGroupDTO } from '~/types/sub-group/dto/UpdateSubGroupDTO';
import { SubGroup } from '~/types/sub-group/sub-group.model';
import { useSetting } from '~/composables/useSettings';
import { io } from 'socket.io-client';
import { BaseService } from './base.service';

const { buildIO } = useSetting();

class SubGroupService extends BaseService {

  constructor() {
    super('sub-group');

    this.socket = io(buildIO('/subgroup'), {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('accessToken') }
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
