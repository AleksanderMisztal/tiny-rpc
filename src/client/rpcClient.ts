import { v4 as uuid } from 'uuid';

export class RpcClient {
  private socket: WebSocket;
  private callbacks: { [uid: string]: Action<SResponse<any>> } = {};
  private handlers: { [topic: string]: Action<any> } = {};

  constructor(
    path: string,
    onConnected?: Action<void>,
    onDisconnected?: Action<void>
  ) {
    const socket = new WebSocket(`ws://${window.location.host}${path}`);
    this.socket = socket;

    socket.onopen = () => onConnected && onConnected();

    socket.onmessage = (m) => this.handleMessage(JSON.parse(m.data));

    socket.onclose = (e) => onDisconnected && onDisconnected();
  }

  public registerHandler<T>(topic: string, handler: Action<T>): void {
    this.handlers[topic] = handler;
  }

  public call<TArg, TRet>(topic: string, args?: TArg): Promise<TRet> {
    const transactionUid = uuid();
    this.send({ topic, transactionUid, args });
    const callback = (resolve: Action<TRet>, reject: Action<string>) => {
      this.callbacks[transactionUid] = (response: SResponse<TRet>) => {
        if (response.status === 'error') reject(response.reason);
        else resolve(response.content);
      };
    };
    const result = new Promise<TRet>(callback);
    return result;
  }

  private handleMessage<T>(message: SMessage<T>): void {
    if (message.type === 'topic') {
      const { topic, content } = message.data;
      this.handlers[topic](content);
    } else if (message.type === 'response') {
      const { transactionUid, response } = message.data;
      this.callbacks[transactionUid](response);
    }
  }

  private send<T>(data: CRequest<T>): void {
    this.socket.send(JSON.stringify(data));
  }
}
