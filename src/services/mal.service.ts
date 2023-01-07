import io from 'socket.io-client';
import { useSetting } from '~/composables';
import { BaseService } from './base.service';
const { buildIO } = useSetting();

class MalService extends BaseService {
  constructor() {
    super();

    this.socket = io(buildIO('/mal'), {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('accessToken') },
    });
  }

  async getAuthURL(): Promise<{ url: string; codeChallenge: string; verifier: string }> {
    return new Promise((resolve) => {
      this.socket.emit('build-auth-url', {}, (payload) => {
        localStorage.setItem('mal_codeChallenge', payload.codeChallenge);
        resolve(payload);
      });
    });
  }

  async login(authCode: string): Promise<{ access_token: string; refresh_token: string }> {
    return new Promise((resolve, error) => {
      try {
        this.socket.emit('login', { authCode, codeVerifier: localStorage.getItem('mal_codeChallenge') }, resolve);
      } catch {
        console.log('Error');

        error();
      }
    });
  }

  async searchSeason(year: string, season: string): Promise<{}> {
    return new Promise((resolve, error) => {
      try {
        this.socket.emit('search-season', { year, season }, resolve);
      } catch {
        console.log('Error');
        error();
      }
    });
  }
}

const service = new MalService();

Object.freeze(service);

export { service };
