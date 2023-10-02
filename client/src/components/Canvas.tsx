import React, { useEffect, useRef, useState } from 'react';
import { wsUrl } from '../constants.ts';
import { IncomingMessage, PixelCoordinate } from '../types';

const Canvas = () => {
  const [pixels, setPixels] = useState<PixelCoordinate[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(wsUrl + 'canvas');

    if (!ws.current) return;

    ws.current.onclose = () => console.log('ws closed!');

    ws.current.onmessage = event => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === 'NEW_MESSAGE') {
        setPixels(prevState => [ ...prevState, decodedMessage.payload.text ]);
      }
    };
  }, [ws.current]);

  return (
    <canvas width={800} height={400} />
  );
};

export default Canvas;