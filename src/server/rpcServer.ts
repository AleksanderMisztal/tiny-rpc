import { Server } from 'http';
import ws from 'ws';
import { v4 as uuid } from 'uuid';
import { RpcSocket } from './rpcSocket';
import { Request } from './request';

export class RpcServer {
  private clients: IMap<RpcSocket> = {};
  private handlers: IMap<(req: Request<any, any>, socket: RpcSocket) => any> = {};
  /**
   * A function that will be executed when a new client connects, receives a socket.
   */
  public onNewClient: Action<RpcSocket> | undefined;

  /**
   * Create a new rpc server and listen for connections.
   * @param server The http server which will be used to open and handle ws connections.
   * @param path The path on which the rpc server will listen, eg. '/rpc'.
   */
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

  /**
   * Register a new handler that will be executed when some client calls the endpoint.
   * @param endpoint Name of the new endpoint.
   * @param handler Function to be executed. Should use the request object to send a response.
   */
  public registerHandler<TArg, TRet>(
    endpoint: string,
    handler: (req: Request<TArg, TRet>, socket: RpcSocket) => void
  ): void {
    this.handlers[endpoint] = handler;
  }
}
