import React, { useEffect, useRef, useState } from 'react';
import { wsUrl } from '../constants.ts';
import { IncomingMessage, PixelCoordinate } from '../types';

const Canvas = () => {
  const [pixels, setPixels] = useState<PixelCoordinate[]>([]);

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const ws = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef) return;

    const ctx = canvasRef.current.getContext('2d');

    pixels.forEach(pixel => {
      ctx.fillRect(pixel.x, pixel.y, 2, 2);
    });
  }, [pixels]);

  useEffect(() => {
    ws.current = new WebSocket(wsUrl + 'canvas');

    if (!ws.current) return;

    ws.current.onclose = () => console.log('ws closed!');

    ws.current.onmessage = event => {
      const { type, payload } = JSON.parse(event.data) as IncomingMessage;

      console.log('ok')
      switch (type) {
        case 'SET_MESSAGES':
          setPixels(prevState => [ ...prevState, ...payload ]);
        case 'NEW_MESSAGE':
          setPixels(prevState => [ ...prevState, payload ]);
      }
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown || !ws.current || !canvasRef.current) return;

    if (ws.current.readyState === WebSocket.OPEN) {
      const pixelCoordinate: PixelCoordinate = {
        x: e.pageX - canvasRef.current.offsetLeft,
        y: e.pageY - canvasRef.current.offsetTop,
      };

      ws.current.send(JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: pixelCoordinate,
      }));
    }
  };

  return (
    <canvas
      width={800}
      height={400}
      ref={canvasRef}
      onMouseMove={sendMessage}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseOut={() => setIsMouseDown(false)}
      onMouseUp={() => setIsMouseDown(false)}
    />
  );
};

export default Canvas;