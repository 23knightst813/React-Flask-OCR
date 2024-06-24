// src/DrawingCanvas.js
import React, { useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';

const DrawingCanvas = ({ onSave }) => {
  const canvasRef = useRef(null);

  const saveDrawing = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.canvas.drawing.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  return (
    <div>
      <CanvasDraw ref={canvasRef} />
      <button onClick={saveDrawing}>Save Drawing</button>
    </div>
  );
};

export default DrawingCanvas;
