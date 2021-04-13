import ws from 'ws';

export class RpcSocket {
  private socket: ws;
  private handlers: IMap<Action<any>> = {};

  constructor(socket: ws, handlers: IMap<Action<any>>) {
    this.socket = socket;
    this.handlers = handlers;
    // binds this
    socket.onmessage = (message) =>
      this.handleMessage(JSON.parse(message.data.toString()));
  }

  public post<T>(data: STopic<T>): void {
    this.sendMessage({ type: 'topic', data });
  }

  private handleMessage<T>(message: CRequest<T>): void {
    const { transactionUid, topic, args } = message;
    if (!this.handlers[topic]) {
      return this.respond(transactionUid, {
        status: 'error',
        reason: 'handler does not exist',
      });
    }
    const content = this.handlers[topic](args);
    this.respond(transactionUid, { status: 'success', content });
  }

  private respond<T>(transactionUid: string, response: SResponse<T>) {
    this.sendMessage({ type: 'response', data: { transactionUid, response } });
  }

  private sendMessage<T>(message: SMessage<T>): void {
    this.socket.send(JSON.stringify(message));
  }
}
