import io from 'socket.io-client';
import { Notify } from 'quasar';
import { useDownload, useSetting } from '~/composables';
import { BaseService } from './base.service';

const { triggerDownload, addToQueue, updateDownload, completeDownload } = useDownload();
const { buildIO } = useSetting();

class TorrentService extends BaseService {
  constructor() {
    super();

    this.socket = io(buildIO('/torrent'), {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('accessToken') },
    });

    this.socket.on('start-downloading', function ({ hash, value }) {
      triggerDownload({ hash, value });
      Notify.create({ type: 'info', message: `Downloading ${value.name as string}`, position: 'bottom-right', progress: true });
    });

    this.socket.on('torrent-queued', function ({ url, fileName }) {
      console.log('Queued', url, fileName);
      Notify.create({ type: 'info', message: `Queued ${fileName as string}`, position: 'bottom-right', progress: true });
      addToQueue(fileName, url);
    });

    this.socket.on('metadata', function ({ hash }) {
      console.log('MetaData', hash);
    });

    this.socket.on('downloading', function ({ hash, value }) {
      updateDownload({ hash, value });
    });

    this.socket.on('downloaded', function ({ hash, name }) {
      completeDownload(hash);
      Notify.create({ type: 'positive', message: `Downloaded ${name as string}`, position: 'bottom-right', progress: true });
    });
  }
}

const service = new TorrentService();

Object.freeze(service);

export { service };
