import * as SocketIOClient from 'socket.io-client';

export class BaseService {
  public socket: SocketIOClient.Socket;

  async refreshToken(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.socket.connected) {
        resolve(true);
      }

      this.socket.auth = { token: localStorage.getItem('accessToken') };

      this.socket.close();
      this.socket.open();

      // @ts-ignore
      this.socket.on('connect', () => resolve(true));
      this.socket.on('error', () => {
        console.log('Test', 'Error!!!');
      });
    });
  }
}
