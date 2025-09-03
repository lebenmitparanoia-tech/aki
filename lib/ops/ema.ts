export function ema(prev: number | null | undefined, next: number, alpha = 0.2): number {
  if (prev === null || prev === undefined || Number.isNaN(prev)) return next;
  return prev + (next - prev) * alpha;
}
