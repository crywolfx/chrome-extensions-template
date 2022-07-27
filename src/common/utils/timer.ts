import { isFunction } from './type';

export const timeout = (time = 10000) => {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      reject('timeout');
      clearTimeout(timer);
      timer = null as any;
    }, time);
  });
};

export function withTimeout<T>(promise: Promise<T> | (() => Promise<T>), time = 10000) {
  const promiseVal = isFunction(promise) ? promise() : promise;
  return Promise.race([promiseVal, timeout(time)]) as Promise<T>;
}
