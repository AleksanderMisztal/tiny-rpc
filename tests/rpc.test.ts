import { RpcClient } from '../src/client/rpcClient';
test('My Greeter', async () => {
  const rpc = new RpcClient('/kela/rpc');
  const data = await rpc.call('get', { collection: 'users' });
  rpc.registerHandler('test', (data) => {});
});
