import React, { useEffect, useRef, useState } from 'react';
import { Square, Circle, Pencil, Eraser, Undo, Download, Maximize2, ZoomIn, ZoomOut, Move } from 'lucide-react';

type Tool = 'rectangle' | 'circle' | 'pencil' | 'eraser' | 'pan';
type DrawAction = {
  tool: Tool;
  points?: { x: number; y: number }[];
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  color: string;
  lineWidth: number;
};

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoom = (delta: number) => {
    setZoom(prevZoom => {
      const newZoom = Math.min(Math.max(prevZoom + delta, 0.1), 5);
      return newZoom;
    });
  };

  const getTransformedPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (currentTool === 'pan') {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const point = getTransformedPoint(e);
    setIsDrawing(true);
    
    const newAction: DrawAction = {
      tool: currentTool,
      color,
      lineWidth,
      points: currentTool === 'pencil' || currentTool === 'eraser' ? [point] : undefined,
      startX: point.x,
      startY: point.y,
    };
    
    setCurrentAction(newAction);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isPanning) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDrawing || !currentAction) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getTransformedPoint(e);

    if (currentTool === 'pencil' || currentTool === 'eraser') {
      ctx.save();
      ctx.setTransform(zoom, 0, 0, zoom, offset.x, offset.y);
      ctx.clearRect(-offset.x/zoom, -offset.y/zoom, canvas.width/zoom, canvas.height/zoom);
      redrawCanvas();
      
      ctx.beginPath();
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentAction.color;
      ctx.lineWidth = currentAction.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      currentAction.points = [...(currentAction.points || []), point];
      
      currentAction.points.forEach((p, i) => {
        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      });
      
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.save();
      ctx.setTransform(zoom, 0, 0, zoom, offset.x, offset.y);
      ctx.clearRect(-offset.x/zoom, -offset.y/zoom, canvas.width/zoom, canvas.height/zoom);
      redrawCanvas();
      
      currentAction.endX = point.x;
      currentAction.endY = point.y;
      
      ctx.beginPath();
      ctx.strokeStyle = currentAction.color;
      ctx.lineWidth = currentAction.lineWidth;
      
      if (currentTool === 'rectangle') {
        const width = point.x - (currentAction.startX || 0);
        const height = point.y - (currentAction.startY || 0);
        ctx.strokeRect(currentAction.startX || 0, currentAction.startY || 0, width, height);
      } else if (currentTool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(point.x - (currentAction.startX || 0), 2) + 
          Math.pow(point.y - (currentAction.startY || 0), 2)
        );
        ctx.arc(currentAction.startX || 0, currentAction.startY || 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  const stopDrawing = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (currentAction) {
      setActions([...actions, currentAction]);
    }
    setIsDrawing(false);
    setCurrentAction(null);
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(zoom, 0, 0, zoom, offset.x, offset.y);

    actions.forEach(action => {
      ctx.beginPath();
      ctx.strokeStyle = action.tool === 'eraser' ? '#ffffff' : action.color;
      ctx.lineWidth = action.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (action.points) {
        action.points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
      } else if (action.startX !== undefined && action.startY !== undefined && action.endX !== undefined && action.endY !== undefined) {
        if (action.tool === 'rectangle') {
          const width = action.endX - action.startX;
          const height = action.endY - action.startY;
          ctx.strokeRect(action.startX, action.startY, width, height);
        } else if (action.tool === 'circle') {
          const radius = Math.sqrt(
            Math.pow(action.endX - action.startX, 2) + 
            Math.pow(action.endY - action.startY, 2)
          );
          ctx.arc(action.startX, action.startY, radius, 0, 2 * Math.PI);
        }
      }
      ctx.stroke();
    });

    ctx.restore();
  };

  const handleUndo = () => {
    if (actions.length === 0) return;
    setActions(actions.slice(0, -1));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataUrl;
    link.click();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    redrawCanvas();
  }, [actions]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-md">
        <button
          onClick={() => setCurrentTool('pencil')}
          className={`p-2 rounded ${currentTool === 'pencil' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          title="Pencil"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => setCurrentTool('rectangle')}
          className={`p-2 rounded ${currentTool === 'rectangle' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          title="Rectangle"
        >
          <Square size={20} />
        </button>
        <button
          onClick={() => setCurrentTool('circle')}
          className={`p-2 rounded ${currentTool === 'circle' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          title="Circle"
        >
          <Circle size={20} />
        </button>
        <button
          onClick={() => setCurrentTool('eraser')}
          className={`p-2 rounded ${currentTool === 'eraser' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>
        <button
          onClick={() => setCurrentTool('pan')}
          className={`p-2 rounded ${currentTool === 'pan' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          title="Pan"
        >
          <Move size={20} />
        </button>
        <div className="h-6 w-px bg-gray-300" />
        <button
          onClick={() => handleZoom(0.1)}
          className="p-2 rounded hover:bg-gray-100"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-2 rounded hover:bg-gray-100"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <div className="h-6 w-px bg-gray-300" />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
          title="Color"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="w-32"
          title="Line Width"
        />
        <div className="h-6 w-px bg-gray-300" />
        <button
          onClick={handleUndo}
          className="p-2 rounded hover:bg-gray-100"
          title="Undo"
        >
          <Undo size={20} />
        </button>
        <button
          onClick={handleDownload}
          className="p-2 rounded hover:bg-gray-100"
          title="Download"
        >
          <Download size={20} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded hover:bg-gray-100"
          title="Toggle Fullscreen"
        >
          <Maximize2 size={20} />
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className={`w-full bg-white rounded-lg shadow-lg border border-gray-200 cursor-crosshair transition-all ${
          isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'
        }`}
      />
    </div>
  );
}