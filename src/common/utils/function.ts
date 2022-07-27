export const throttle = (fn: (...props: any[]) => any, delay: number) => {
  let startTime = +new Date();
  let timer: any = undefined;
  return function (this: any, ...args: any[]) {
    const nowTime = +new Date();
    const leftTime = nowTime - startTime;
    if (leftTime >= delay) {
      fn.call(this, ...args);
      startTime = nowTime;
    } else {
      clearTimeout(timer);
      timer = undefined;
      const afterTime = delay - leftTime;
      timer = setTimeout(() => {
        fn.call(this, ...args);
        clearTimeout(timer);
        timer = undefined;
      }, afterTime);
    }
  };
};

export const debounce = (fn: (...props: any[]) => any, delay: number) => {
  let timer: any = null;
  return function (this: any, ...props: any) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, ...props);
      clearTimeout(timer);
      timer = null;
    }, delay);
  };
};
