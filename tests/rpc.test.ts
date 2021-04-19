import { RpcClient } from '../src/client/rpcClient';
test('My Greeter', async () => {
  const rpc = new RpcClient('/kela/rpc');
  await rpc.connect();
  const data = await rpc.call('get', { collection: 'users' });
  rpc.subscribe('test', (data: {}) => {});
});
