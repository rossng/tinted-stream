import { useCallback, useEffect, useRef, useState } from 'react';
import { hsvToRgb } from './colour';

export interface ChromaValueProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (_: [saturation: number, value: number]) => void;
}

export function ChromaValue({
  hue,
  saturation,
  value,
  onChange,
}: ChromaValueProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Set up resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      setDimensions({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      });
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = ref.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const newSaturation = Math.max(0, Math.min(1, x / (canvas.width - 1)));
      const newValue = Math.max(0, Math.min(1, 1 - y / (canvas.height - 1)));
      onChange([newSaturation, newValue]);
    },
    [onChange],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      isDragging.current = true;
      updatePosition(event.clientX, event.clientY);
    },
    [updatePosition],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(event.clientX, event.clientY);
    },
    [updatePosition],
  );

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.createImageData(canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const s = x / (canvas.width - 1);
        const v = 1 - y / (canvas.height - 1);
        const [r, g, b] = hsvToRgb(hue, s, v);

        const idx = 4 * (y * canvas.width + x);
        imageData.data[idx + 0] = Math.round(r * 255);
        imageData.data[idx + 1] = Math.round(g * 255);
        imageData.data[idx + 2] = Math.round(b * 255);
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [hue, dimensions]);

  const [r, g, b] = hsvToRgb(hue, saturation, value);
  const selectorColour = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  const borderColour =
    value > 0.5 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={ref}
        onMouseDown={handleMouseDown}
        className="cursor-crosshair block"
      />
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg pointer-events-none"
        style={{
          left: `${saturation * 100}%`,
          top: `${(1 - value) * 100}%`,
          border: `2px solid ${borderColour}`,
          backgroundColor: selectorColour,
          boxShadow: '0 0 4px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
}
