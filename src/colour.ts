export function hsvToRgb(
  h: number,
  s: number,
  v: number,
): [number, number, number] {
  const f = (n: number, k = (n + h * 6) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
}

// https://stackoverflow.com/a/54070620
export function rgbToHsv(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const v = Math.max(r, g, b);
  const c = v - Math.min(r, g, b);
  const h =
    c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
  return [(h < 0 ? h + 6 : h) / 6, v && c / v, v];
}

export function isDark(r: number, g: number, b: number) {
  // Calculate relative luminance using sRGB
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 0.5;
}
