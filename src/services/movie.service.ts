import io from 'socket.io-client';
import { useSetting, useMovies } from '~/composables';
import { SourceLocation, MediaCollection, MediaItem, MediaQuickLink } from '~/types/movie/movie.models';
import { BaseService } from './base.service';

const { buildIO } = useSetting();

class MovieService extends BaseService {
  constructor() {
    super('movie');

    this.socket = io(buildIO('/movie'), {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('accessToken') },
    });

    this.socket.on('updated-meta', ({ link, items }: { link: string; items: MediaItem[] }) => {
      useMovies().setMeta(link, items);
    });
  }

  async search(query: string, source: SourceLocation): Promise<MediaCollection[]> {
    return new Promise((resolve) => {
      this.socket.emit('search', { query, source }, resolve);
    });
  }

  async findMeta(query: string): Promise<MediaItem[]> {
    return new Promise((resolve) => {
      this.socket.emit('meta', query, resolve);
    });
  }

  async findQuickLinks(source = SourceLocation.THE_PIRATE_BAY): Promise<MediaQuickLink[]> {
    return new Promise((resolve) => {
      this.socket.emit('quick-links', { source }, resolve);
    });
  }
}

const service = new MovieService();

Object.freeze(service);

export { service };
