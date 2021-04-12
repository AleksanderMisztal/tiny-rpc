import express from 'express';
import { RpcServer } from './rpcServer';

const app = express();
app.use(express.static(__dirname + '/public'));

const server = app.listen(3000, () => console.log(`Listening on ${3000}`));

const rpc = new RpcServer(server, '/rpc');

rpc.registerHandler('getNumber', (_data) => 42);

rpc.onNewClient = (client) => {
  let counter = 0;
  client.post({ topic: 'xddd', content: 'hiiii' });
  setInterval(
    () => client.post({ topic: 'xddd', content: `Message #${counter++}` }),
    10000
  );
};
