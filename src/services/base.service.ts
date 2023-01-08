import * as SocketIOClient from 'socket.io-client';

export class BaseService {
  public socket: SocketIOClient.Socket;

  constructor(private serviceName: string) { }

  async refreshToken(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.socket.connected) {
        console.log('Connected', this.serviceName);
        resolve(true);
        return;
      }

      this.socket.auth = { token: localStorage.getItem('accessToken') };

      this.socket.close();
      this.socket.open();

      // @ts-ignore
      this.socket.on('connect', () => {
        console.log('Connected', this.serviceName);
        resolve(true)
      });
      this.socket.on('error', () => {
        console.log('Test', 'Error!!!');
      });
    });
  }
}
