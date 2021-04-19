import { v4 as uuid } from 'uuid';

export class RpcClient {
  private socket: WebSocket;
  private callbacks: { [uid: string]: Action<SResponse<any>> } = {};
  private handlers: { [topic: string]: Action<any> } = {};
  private connection: Promise<void>;

  /**
   * Creates a new client and starts connecting to the rpc server.
   * @param path The path relative to host, eg. '/rpc'
   * @param host Address of the host, eg. 'localhost:5000'. Defaults to where the page is served from.
   * @param onDisconnected Disconnect callback, use to reconnect etc
   */
  constructor(path: string, host?: string, onDisconnected?: Action<void>) {
    let resolve: Action<void>;
    this.connection = new Promise((res) => (resolve = res));
    const actualHost = host || window.location.host;
    const socket = new WebSocket(`ws://${actualHost}${path}`);
    this.socket = socket;

    socket.onopen = () => resolve();

    socket.onmessage = (m) => this.handleMessage(JSON.parse(m.data));

    socket.onclose = (_e) => onDisconnected && onDisconnected();
  }
  /**
   * Awaits the completion of the connection initiated in the constructor.
   */
  public async connect() {
    await this.connection;
  }
  /**
   * Decide what happens when the server pushes a message to this client in topic.
   * @param topic Topic to subscribe to.
   * @param onMessage The callback to be executed, receives the message content (json).
   */
  public subscribe<T>(topic: string, onMessage: Action<T>): void {
    this.handlers[topic] = onMessage;
  }
  /**
   * Calls a procedure on server and awaits the result.
   * @param endpoint The endpoint to be called.
   * @param args Data passed as argument
   * @returns Promise that resolves to data returned by server or rejects with reason (string).
   */
  public call<TArg, TRet>(endpoint: string, args?: TArg): Promise<TRet> {
    const transactionUid = uuid();
    this.send({ topic: endpoint, transactionUid, args });
    const callback = (resolve: Action<TRet>, reject: Action<string>) => {
      this.callbacks[transactionUid] = (response: SResponse<TRet>) => {
        if (response.status === 'error') reject('Rpc error: ' + response.reason);
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
