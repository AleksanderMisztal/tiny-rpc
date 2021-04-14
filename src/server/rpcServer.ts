import { Server } from 'http';
import ws from 'ws';
import { v4 as uuid } from 'uuid';
import { RpcSocket } from './rpcSocket';

export class RpcServer {
  private clients: IMap<RpcSocket> = {};
  private handlers: IMap<(s: RpcSocket, args: any) => any> = {};
  public onNewClient: Action<RpcSocket> | undefined;

  constructor(server: Server, path: string) {
    const wsServer = new ws.Server({ server, path });
    // wrapping in anon necessary to bind this correctly
    wsServer.on('connection', (socket) => this.handleWsConnection(socket));
  }

  private handleWsConnection(socket: ws) {
    const uid = uuid();
    const client = new RpcSocket(socket, this.handlers);
    this.clients[uid] = client;
    if (this.onNewClient) this.onNewClient(this.clients[uid]);
  }

  public registerHandler<TArg, TRet>(
    topic: string,
    handler: (s: RpcSocket, args: TArg) => TRet
  ): void {
    this.handlers[topic] = handler;
  }
}
