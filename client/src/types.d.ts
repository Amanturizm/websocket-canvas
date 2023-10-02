export interface PixelCoordinate {
  x: number;
  y: number;
}

export interface IncomingMessage {
  type: string;
  payload: PixelCoordinate;
}