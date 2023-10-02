import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import * as crypto from 'crypto';
import { ActiveConnections, IncomingMessage } from './types';

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();

const activeConnections: ActiveConnections = {};

router.ws('/chat', (ws, req) => {
  const id = crypto.randomUUID();
  console.log('Client connected! id=', id);
  activeConnections[id] = ws;

  ws.on('close', () => {
    console.log('Client disconnected! id=', id);
    delete activeConnections[id];
  });

  let username = 'Anonymous';

  ws.on('message', (msg) => {
    const { type, payload } = JSON.parse(msg.toString()) as IncomingMessage;

    switch (type) {
      case 'SET_USERNAME':
        username = payload;
        break;
      case 'SEND_MESSAGE':
        Object.keys(activeConnections).forEach(connId => {
          const conn = activeConnections[connId];
          conn.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: {
              username,
              text: payload
            },
          }));
        });
        break;
      default:
        console.log('Unknown message type:', type);
    }
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Server started on ${port} port...`)
});