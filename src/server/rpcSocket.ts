import ws from 'ws';
import { Request } from './request';

export class RpcSocket {
  private socket: ws;
  private handlers: IMap<(req: Request<any, any>, socket: RpcSocket) => void> = {};

  constructor(socket: ws, handlers: IMap<(req: Request<any, any>, socket: RpcSocket) => void>) {
    this.socket = socket;
    this.handlers = handlers;
    socket.onmessage = (m) => this.handleMessage(JSON.parse(m.data.toString()));
  }

  public post<T>(topic: string, content: T): void {
    this.sendMessage({ type: 'topic', data: { topic, content } });
  }

  private handleMessage<TArg, TRet>(message: CRequest<TArg>): void {
    const { transactionUid, topic, args } = message;
    if (!this.handlers[topic]) {
      return this.respondError(transactionUid, 'handler does not exist on server');
    }
    const req = new Request<TArg, TRet>(
      args,
      (content: TRet) => this.respondOk(transactionUid, content),
      (reason: string) => this.respondError(transactionUid, reason)
    );
    this.handlers[topic](req, this);
  }

  private respondOk<T>(transactionUid: string, content: T) {
    this.sendMessage({
      type: 'response',
      data: { transactionUid, response: { status: 'success', content } },
    });
  }

  private respondError(transactionUid: string, reason: string) {
    this.sendMessage({
      type: 'response',
      data: { transactionUid, response: { status: 'error', reason } },
    });
  }

  private sendMessage<T>(message: SMessage<T>): void {
    this.socket.send(JSON.stringify(message));
  }
}
