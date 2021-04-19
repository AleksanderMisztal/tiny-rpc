type Action<T> = (data: T) => void;
type Action2<T, S> = (arg1: T, arg2: S) => void;

interface IMap<T> {
  [name: string]: T;
}

interface CRequest<T> {
  transactionUid: string;
  topic: string;
  args: T;
}

type STopic<T> = { topic: string; content: T };
type SResponse<T> = { status: 'success'; content: T } | { status: 'error'; reason: string };
type SReply<T> = { transactionUid: string; response: SResponse<T> };

type SMessage<T> = { type: 'topic'; data: STopic<T> } | { type: 'response'; data: SReply<T> };
