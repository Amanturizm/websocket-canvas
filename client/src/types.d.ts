export interface PixelCoordinate {
  x: number;
  y: number;
};

export interface WSMessage {
  username: string;
  text: PixelCoordinate;
}

export interface IncomingMessage {
  type: string;
  payload: WSMessage;
}