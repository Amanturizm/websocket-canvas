import React, { useEffect, useRef, useState } from 'react';
import { wsUrl } from '../constants.ts';
import { IncomingMessage, PixelCoordinate } from '../types';

const Canvas = () => {
  const [pixels, setPixels] = useState<PixelCoordinate[]>([]);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>('#000000');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!canvasRef) return;

    const ctx = canvasRef.current.getContext('2d');

    pixels.forEach((pixel) => {
      ctx.fillStyle = pixel.color;
      ctx.fillRect(pixel.x, pixel.y, 2, 2);
    });
  }, [pixels]);

  useEffect(() => {
    wsRef.current = new WebSocket(wsUrl + 'canvas');

    if (!wsRef.current) return;

    wsRef.current.onclose = () => console.log('ws closed!');

    wsRef.current.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data) as IncomingMessage;

      switch (type) {
        case 'SET_MESSAGES':
          setPixels((prevState) => [...prevState, ...payload]);
          break;
        case 'NEW_MESSAGE':
          setPixels((prevState) => [...prevState, payload]);
          break;
      }
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown || !canvasRef.current || !wsRef.current) return;

    const pixelCoordinate: PixelCoordinate = {
      x: e.pageX - canvasRef.current.offsetLeft,
      y: e.pageY - canvasRef.current.offsetTop,
      color: currentColor,
    };

    wsRef.current.send(JSON.stringify({ type: 'SEND_MESSAGE', payload: pixelCoordinate }));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
      <input
        className="form-control form-control-color mb-2"
        style={{ width: 60, height: 60 }}
        type="color"
        value={currentColor}
        onChange={(e) => setCurrentColor(e.target.value)}
      />

      <canvas
        className="border border-2 border-dark rounded-4"
        style={{ cursor: 'crosshair' }}
        width={800}
        height={400}
        ref={canvasRef}
        onMouseMove={sendMessage}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseOut={() => setIsMouseDown(false)}
        onMouseUp={() => setIsMouseDown(false)}
      />
    </div>
  );
};

export default Canvas;