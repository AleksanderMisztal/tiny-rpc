import { RpcClient } from '../src/client/rpcClient';
import { Request } from '../src/server/request';
test('Client syntax', async () => {
  const rpc = new RpcClient('/kela/rpc');
  await rpc.connect();
  const data = await rpc.call('get', { collection: 'users' });
  rpc.subscribe('test', (data: {}) => {});
});

import { RpcServer } from '../src/server/rpcServer';

test('Client syntax', async () => {
  const rpc = new RpcServer(server, '/rpc');

  rpc.registerHandler('getTime', (req: Request<{}, number>) => req.replyOk(Date.now()));

  rpc.onNewClient = (client) => client.post('messages', 'Hello client!');
});
