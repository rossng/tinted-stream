import { useState } from 'react';
import { ChromaValue } from './ChromaValue';
import { Hue } from './Hue';
import { hsvToRgb } from './colour';

export default function App() {
  const [hue, setHue] = useState(0.33);
  const [saturationValue, setSaturationValue] = useState([0.5, 0.5]);
  const rgb = hsvToRgb(hue, saturationValue[0], saturationValue[1]);
  const rgbString = `rgb(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255})`;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: rgbString,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Hue hue={hue} onChange={setHue} />
        <ChromaValue
          hue={hue}
          saturation={saturationValue[0]}
          value={saturationValue[1]}
          onChange={([saturation, value]) => {
            setSaturationValue([saturation, value]);
          }}
        />
      </div>
    </div>
  );
}
