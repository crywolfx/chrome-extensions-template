import { contentLog } from './log';

export function retry<T>(promiseFunction: () => Promise<T>, maxCount = 1) {
  const retryFunction = (currentPromise: () => Promise<any>, count = 0): Promise<T> => {
    return currentPromise().catch((error) => {
      if (count < maxCount) {
        contentLog('重试');
        return retryFunction(currentPromise, count + 1);
      }
      return Promise.reject(error);
    });
  };
  return retryFunction(promiseFunction, 0);
}
