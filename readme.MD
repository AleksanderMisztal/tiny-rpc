# tiny-rpc

A node package that allows rpc over websockets and pushing messages from server to client with as few lines of code as possible. Written in typescript.

### Server

```javascript
import { RpcServer } from '@vmisztvl/tiny-rpc';

const rpc = new RpcServer(server, '/rpc');

rpc.registerHandler('getTime', () => Date.now());

rpc.onNewClient = (client) =>
  client.post({ topic: 'messages', content: 'Hello client!' });
```

### Client

```javascript
import { RpcClient } from '@vmisztvl/tiny-rpc';

const rpc = new RpcClient('/rpc');

rpc.registerHandler('messages', addMessage);

button.onclick = async () => {
  const data = await rpc.call('getTime');
  console.log(data);
};
```

Full example repo available [here](https://github.com/AleksanderMisztal/tiny-rpc-examples).
