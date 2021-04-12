import { RpcClient } from './rpcClient';

const button = document.getElementById('button') as HTMLButtonElement;
const number = document.getElementById('number') as HTMLElement;
const messages = document.getElementById('messages') as HTMLElement;

const addMessage = (m: string) => {
  const p = document.createElement('p');
  p.innerHTML = m;
  messages.appendChild(p);
};

const rpc = new RpcClient('/rpc');

rpc.registerHandler<string>('xddd', addMessage);

button.onclick = async () => {
  const data = await rpc.call<undefined, number>('getNumber');
  number.innerHTML = data.toString();
};
