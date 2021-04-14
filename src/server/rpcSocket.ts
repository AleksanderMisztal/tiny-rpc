import ws from 'ws';

export class RpcSocket {
  private socket: ws;
  private handlers: IMap<(s: RpcSocket, args: any) => any> = {};

  constructor(socket: ws, handlers: IMap<(s: RpcSocket, args: any) => any>) {
    this.socket = socket;
    this.handlers = handlers;
    socket.onmessage = (m) => this.handleMessage(JSON.parse(m.data.toString()));
  }

  public post<T>(topic: string, content: T): void {
    this.sendMessage({ type: 'topic', data: { topic, content } });
  }

  private handleMessage<T>(message: CRequest<T>): void {
    const { transactionUid, topic, args } = message;
    if (!this.handlers[topic]) {
      this.respond(transactionUid, {
        status: 'error',
        reason: 'handler does not exist on server',
      });
      return;
    }
    const content = this.handlers[topic](this, args);
    this.respond(transactionUid, { status: 'success', content });
  }

  private respond<T>(transactionUid: string, response: SResponse<T>) {
    this.sendMessage({ type: 'response', data: { transactionUid, response } });
  }

  private sendMessage<T>(message: SMessage<T>): void {
    this.socket.send(JSON.stringify(message));
  }
}
