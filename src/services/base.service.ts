import * as SocketIOClient from 'socket.io-client';

export class BaseService {
    public socket: SocketIOClient.Socket;

    refreshToken() {
        this.socket.auth = { token: localStorage.getItem('accessToken') };
    }
}