import { useEffect, useState } from 'react';
import './App.css';
import { Controls } from './Controls';
import { hsvToRgb, isDark } from './colour';

const STORAGE_KEY = 'saved-hsv';

export default function App() {
  const [hsv, setHsv] = useState<[number, number, number]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as [number, number, number];
      } catch {
        return [Math.random(), Math.random(), Math.random()];
      }
    }
    return [Math.random(), Math.random(), Math.random()];
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Save to localStorage whenever hsv changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hsv));
  }, [hsv]);

  const rgb = hsvToRgb(...hsv);
  const rgbString = `rgb(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255})`;
  const darkBackground = isDark(rgb[0], rgb[1], rgb[2]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', rgbString);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = rgbString;
      document.head.appendChild(meta);
    }
  }, [rgbString]); // Update whenever color changes

  return (
    <div
      className={`min-h-screen min-w-screen overflow-auto ${darkBackground ? 'text-white' : 'text-black'}`}
      style={{ backgroundColor: rgbString }}
    >
      {!isFullscreen && (
        <>
          <Controls hsv={hsv} onColourChange={setHsv} />
          <a
            href="https://github.com/rossng/tinted-stream"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-4 bottom-4 flex h-4 w-4 items-center justify-center rounded-full bg-current/20 shadow-lg"
            title="About"
          >
            <span
              className="text-xs"
              style={{ transform: 'translate(0px, 1px)' }}
            >
              i
            </span>
          </a>
        </>
      )}
    </div>
  );
}
