import { useCallback, useEffect, useRef, useState } from 'react';
import { hsvToRgb } from './colour';

export interface HueProps {
  hue: number;
  onChange: (hue: number) => void;
}

export function Hue({ hue, onChange }: HueProps) {
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

  const updateHue = useCallback(
    (clientX: number) => {
      const canvas = ref.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const newHue = Math.max(0, Math.min(1, x / (canvas.width - 1)));
      onChange(newHue);
    },
    [onChange],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      isDragging.current = true;
      updateHue(event.clientX);
    },
    [updateHue],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging.current) return;
      updateHue(event.clientX);
    },
    [updateHue],
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

  // Draw gradient effect
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.createImageData(canvas.width, canvas.height);

    // Draw the hue gradient
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const h = x / (canvas.width - 1);
        const s = 1;
        const v = 1;

        const [r, g, b] = hsvToRgb(h, s, v);

        const idx = 4 * (y * canvas.width + x);
        imageData.data[idx + 0] = Math.round(r * 255);
        imageData.data[idx + 1] = Math.round(g * 255);
        imageData.data[idx + 2] = Math.round(b * 255);
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [dimensions]);

  const [r, g, b] = hsvToRgb(hue, 1, 1);
  const markerColour = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;

  return (
    <div className="relative h-full w-full" ref={containerRef}>
      <canvas
        ref={ref}
        onMouseDown={handleMouseDown}
        className="block h-full w-full cursor-pointer"
      />
      <div
        className="pointer-events-none absolute inset-y-0 w-2 -translate-x-1/2 rounded shadow-lg"
        style={{
          left: `${hue * 100}%`,
          backgroundColor: markerColour,
          boxShadow: '0 0 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.5)',
        }}
      />
    </div>
  );
}
