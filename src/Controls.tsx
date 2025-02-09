import { useCallback } from 'react';
import { ChromaValue } from './ChromaValue';
import { hsvToRgb, rgbToHsv } from './colour';
import { Hue } from './Hue';
import { NumberInput } from './NumberInput';

interface ControlsProps {
  hsv: [number, number, number];
  onColourChange: (hsv: [number, number, number]) => void;
}

export function Controls({ hsv, onColourChange }: ControlsProps) {
  const [hue, saturation, value] = hsv;
  const rgb = hsvToRgb(hue, saturation, value);

  const onRgbChange = useCallback(
    (rgb: [number, number, number]) => {
      const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      onColourChange(hsv);
    },
    [onColourChange],
  );

  return (
    <div className="flex h-screen flex-col items-stretch sm:flex-row">
      <div className="flex shrink flex-col justify-center sm:h-full sm:w-[40%]">
        <div className="m-5 flex max-h-40 flex-col overflow-hidden rounded shadow-lg sm:max-h-full">
          <div className="h-[50px] w-full flex-shrink">
            <Hue
              hue={hue}
              onChange={(h) => onColourChange([h, saturation, value])}
            />
          </div>
          <div className="aspect-square min-h-10 w-full sm:flex-grow">
            <ChromaValue
              hue={hue}
              saturation={saturation}
              value={value}
              onChange={([s, v]) => onColourChange([hue, s, v])}
            />
          </div>
        </div>
      </div>
      <div className="m-5 flex flex-col items-center justify-center gap-5 sm:w-[30%] sm:grow">
        <div className="@container flex w-full flex-row items-center gap-2.5 overflow-clip sm:flex-col">
          <div className="text-center font-[FingerPaint] text-lg transition-colors duration-200">
            hsv
          </div>
          <div className="flex grow flex-col justify-between gap-2.5 sm:text-2xl @max-sm:text-sm @xs:flex-row">
            <NumberInput
              value={hue * 255}
              onChange={(v) => onColourChange([v / 255, saturation, value])}
              className="flex-shrink flex-grow bg-current/20 text-center transition-colors duration-200"
              title="Hue"
            />
            <NumberInput
              value={saturation * 255}
              onChange={(v) => onColourChange([hue, v / 255, value])}
              className="flex-shrink flex-grow bg-current/20 text-center transition-colors duration-200"
              title="Saturation"
            />
            <NumberInput
              value={value * 255}
              onChange={(v) => onColourChange([hue, saturation, v / 255])}
              className="flex-shrink flex-grow bg-current/20 text-center transition-colors duration-200"
              title="Value"
            />
          </div>
        </div>
        <div className="@container flex w-full flex-row items-center gap-2.5 overflow-clip sm:flex-col">
          <div className="text-center font-[FingerPaint] text-lg transition-colors duration-200">
            rgb
          </div>
          <div className="flex grow flex-col justify-between gap-2.5 sm:text-2xl @max-sm:text-sm @xs:flex-row">
            <NumberInput
              value={rgb[0] * 255}
              onChange={(v) => onRgbChange([v / 255, rgb[1], rgb[2]])}
              className="flex-shrink flex-grow bg-current/20 text-center transition-colors duration-200"
              title="Red"
            />
            <NumberInput
              value={rgb[1] * 255}
              onChange={(v) => onRgbChange([rgb[0], v / 255, rgb[2]])}
              className="flex-shrink flex-grow bg-current/20 text-center transition-colors duration-200"
              title="Green"
            />
            <NumberInput
              value={rgb[2] * 255}
              onChange={(v) => onRgbChange([rgb[0], rgb[1], v / 255])}
              className="flex-shrink flex-grow bg-current/20 text-center transition-colors duration-200"
              title="Blue"
            />
          </div>
        </div>
        <div className="flex flex-row gap-2.5">
          <button
            title="White"
            className="h-10 w-10 rounded-full border-2 border-current bg-[#ffffff] shadow-lg"
            onClick={() => onColourChange([0, 0, 1])}
          ></button>
          <button
            title="Red"
            className="h-10 w-10 rounded-full border-2 border-current bg-[#ff0000] shadow-lg"
            onClick={() => onColourChange([0, 1, 1])}
          ></button>
          <button
            title="Blue"
            className="h-10 w-10 rounded-full border-2 border-current bg-[#0000ff] shadow-lg"
            onClick={() => onColourChange([2 / 3, 1, 1])}
          ></button>
          <button
            title="Green"
            className="h-10 w-10 rounded-full border-2 border-current bg-[#00ff00] shadow-lg"
            onClick={() => onColourChange([1 / 3, 1, 1])}
          ></button>
          <button
            title="Black"
            className="h-10 w-10 rounded-full border-2 border-current bg-[#000000] shadow-lg"
            onClick={() => onColourChange([0, 0, 0])}
          ></button>
          <button
            title="Random"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current bg-transparent shadow-lg"
            onClick={() =>
              onColourChange([Math.random(), Math.random(), Math.random()])
            }
          >
            <span
              className="text-2xl"
              style={{ transform: 'translate(-1px, 2px)' }}
            >
              ?
            </span>
          </button>
        </div>
      </div>
      <div className="m-5 flex shrink grow flex-col items-center justify-center sm:w-[30%]">
        <button
          onClick={() => {
            document.documentElement.requestFullscreen();
          }}
          className="flex aspect-square w-[80%] cursor-pointer flex-col items-center justify-center rounded-xl bg-current/20 p-5 shadow-lg transition-shadow duration-200 outline-none hover:bg-current/30 hover:transition-colors"
          title="Fullscreen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="max-h-[80%] min-h-10 overflow-visible transition-[stroke] duration-200 sm:h-auto sm:w-[60%]"
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            stroke="currentColor"
            fill="none"
            strokeWidth="4"
          >
            <path d="M 0,16 v 8 h 8" id="path1" />
            <path d="M 0,8 v -8 h 8" id="path2" />
            <path d="M 16,24 h 8 v -8" id="path3" />
            <path d="M 16,0 h 8 v 8" id="path4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
