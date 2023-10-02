export interface PixelCoordinate {
  x: string;
  y: string;
};

export interface WSMessage {
  username: string;
  text: PixelCoordinate;
}

export interface IncomingMessage {
  type: string;
  payload: WSMessage;
}