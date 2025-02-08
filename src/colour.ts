export function hsvToRgb(h: number, s: number, v: number) {
  const f = (n: number, k = (n + h * 6) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
}
