import { useRef, useEffect, forwardRef } from "react";
import canvasTxt from "canvas-txt";

const CanvasText = forwardRef(({ changeText }, ref) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#FFC059";

    canvasTxt.fontSize = 38;
    canvasTxt.font = "Gochi Hand, cursive";
    canvasTxt.fontWeight = "bold";

    canvasTxt.drawText(ctx, changeText, 20, 40, 400, 300);
  }, [changeText]);

  return <canvas ref={canvasRef} width="500" height="400" />;
});

export default CanvasText;
