import { WebSocket } from 'ws';

export interface PixelCoordinate {
  x: number;
  y: number;
}

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface IncomingMessage {
  type: string;
  payload: string;
};