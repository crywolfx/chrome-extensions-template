export function isRef<T>(val: any): val is React.RefObject<T> {
  if (val?.current) return true;
  return false;
}
