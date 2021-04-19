export class Request<TArg, TRet> {
  /**
   * The data passed by client.
   */
  public body: TArg;
  /**
   * Call with the result upon successful completion to return data to the client.
   */
  public replyOk: Action<TRet>;
  /**
   * Call with error message to notify the client about the error.
   */
  public replyError: Action<string>;

  /**@internal */
  constructor(body: TArg, replyOk: Action<TRet>, replyError: Action<string>) {
    this.body = body;
    this.replyOk = replyOk;
    this.replyError = replyError;
  }
}
