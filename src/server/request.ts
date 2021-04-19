import { RpcSocket } from './rpcSocket';

export class Request<TArg, TRet> {
  public body: TArg;
  public replyOk: Action<TRet>;
  public replyError: Action<string>;
  public socket: RpcSocket;
  constructor(body: TArg, replyOk: Action<TRet>, replyError: Action<string>, socket: RpcSocket) {
    this.body = body;
    this.replyOk = replyOk;
    this.replyError = replyError;
    this.socket = socket;
  }
}
