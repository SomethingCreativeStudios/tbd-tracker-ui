import io from 'socket.io-client';
import { useSetting } from '~/composables';
import { BaseService } from './base.service';

const { buildIO } = useSetting();

class FileService extends BaseService {
  constructor() {
    super();

    this.socket = io(buildIO('/file'), {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('accessToken') },
    });
  }

  async directoryUp(path: string) {
    return new Promise((resolve) => {
      this.socket.emit('dir-up', { path }, resolve);
    });
  }

  async getParentDir(path: string) {
    return new Promise((resolve) => {
      this.socket.emit('dir-parent', { path }, resolve);
    });
  }

  async directoryGoTo(path: string) {
    return new Promise((resolve) => {
      this.socket.emit('dir-go-to', { path }, resolve);
    });
  }
}

const service = new FileService();

Object.freeze(service);

export { service };
