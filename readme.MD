# tiny-rpc

A node package that allows rpc over websockets and pushing messages from server to client.

- Focused on simplicity.
- Promise api.
- Written in typescript.

[Package repo](https://github.com/AleksanderMisztal/tiny-rpc)

[Full example](https://github.com/AleksanderMisztal/tiny-rpc-examples)

### Server

```javascript
import { RpcServer } from '@vmisztvl/tiny-rpc';

const rpc = new RpcServer(server, '/rpc');

rpc.registerHandler('getTime', () => Date.now());

rpc.onNewClient = (client) => client.post('messages', 'Hello client!');
```

### Client

```javascript
import { RpcClient } from '@vmisztvl/tiny-rpc';

const rpc = new RpcClient('/rpc');

rpc.subscribe('messages', addMessage);

button.onclick = async () => {
  const data = await rpc.call('getTime');
  console.log(data);
};
```

_Please do submit feature requests / bugs / questions / suggestions._
