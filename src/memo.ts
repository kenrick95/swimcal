export function createMemo() {
  const map = new Map();
  return function memo<T>(callbackFn: () => T, params: any[]) {
    const key = JSON.stringify(params);

    if (map.has(key)) {
      return map.get(key) as T;
    }
    const result = callbackFn();
    map.set(key, result);
    return result as T;
  };
}
