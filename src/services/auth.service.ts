import io from 'socket.io-client';
import { useSetting } from '~/composables';
import { BaseService } from './base.service';
const { buildIO } = useSetting();

class AuthService extends BaseService {

    constructor() {
        super('auth');

        this.socket = io(buildIO('/auth'), {
            transports: ['websocket'],
        });
    }

    async login(username: string, password: string): Promise<{ accessToken: string }> {
        return new Promise((resolve) => {
            this.socket.emit('token', { username, password }, resolve);
        });
    }

    async validateToken(token: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.socket.emit('validate-token', { token }, resolve);
        });
    }
}

const service = new AuthService();

Object.freeze(service);

export { service };