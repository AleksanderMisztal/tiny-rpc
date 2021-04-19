export class Request<TArg, TRet> {
  public body: TArg;
  public replyOk: Action<TRet>;
  public replyError: Action<string>;
  constructor(body: TArg, replyOk: Action<TRet>, replyError: Action<string>) {
    this.body = body;
    this.replyOk = replyOk;
    this.replyError = replyError;
  }
}
