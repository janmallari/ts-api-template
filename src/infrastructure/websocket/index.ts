import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

class WebSocket {
  private static _instance: WebSocket;
  private _io: Server | null = null;

  private constructor() {}

  public static getInstance(): WebSocket {
    if (!WebSocket._instance) {
      WebSocket._instance = new WebSocket();
    }
    return WebSocket._instance;
  }

  public initialize(server: HttpServer): void {
    const isDevelop = process.env.NODE_ENV === 'development';

    this._io = new Server(server, {
      cors: {
        origin: '*',
        credentials: true,
      },
    });

    this._io.on('connection', (socket: Socket) => {
      const { origin } = socket.client.request.headers;
      const isDashboard =
        origin === 'http://localhost:3000' ? '🕹️ Adimn' : '📱 Mobile';

      const client = isDevelop ? isDashboard : '';

      console.log(`${client} Client connected: ${socket.id}`);

      // Define your event listeners here
      socket.on('disconnect', () => {
        console.log(`${client} Client disconnected: ${socket.id}`);
      });
    });
  }

  public sendToAll(eventName: string, data: unknown): void {
    this._io?.emit(eventName, data);
  }

  public sendToSocket(
    socketId: string,
    eventName: string,
    data: unknown
  ): void {
    this._io?.to(socketId).emit(eventName, data);
  }
}

export default WebSocket;
