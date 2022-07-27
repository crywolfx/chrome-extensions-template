export function isFunction(val: any): val is (...args: any[]) => any {
  return Object.prototype.toString.call(val) === '[object Function]';
}
export function isArray<T extends any>(val: any): val is T[] {
  return Object.prototype.toString.call(val) === '[object Array]';
}
export function isDate(val: any): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]';
}
export function isString(val: any): val is string {
  return Object.prototype.toString.call(val) === '[object String]';
}
export function isNumber(val: any): val is number {
  return Object.prototype.toString.call(val) === '[object Number]';
}
export function isRegExp(val: any): val is RegExp {
  return Object.prototype.toString.call(val) === '[object RegExp]';
}
export function isObject(val: any): val is Record<string, any> {
  return Object.prototype.toString.call(val) === '[object Object]';
}
export function isFormData(val: any): val is FormData {
  return Object.prototype.toString.call(val) === '[object FormData]';
}
export function isUndefined(val: any): val is undefined {
  return val === undefined;
}
export function isNull(val: any): val is null {
  return val === null;
}
export function isDef<T extends any>(val: any): val is T {
  return !isUndefined(val) && !isNull(val);
}

export type FilterKeys<T, U> = {
  [K in keyof T]: K extends U ? never : K;
}[keyof T];

export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends (...args: any[]) => any
  ? T
  : T extends Record<string, unknown>
  ? DeepReadonlyObject<T>
  : T;

type DeepReadonlyArray<T> = Record<string, unknown> & readonly DeepReadonly<T>[];

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export function jsonParse(string: string) {
  if (!string) return null;
  if (!isString(string)) return string;
  try {
    const data = JSON.parse(string);
    return data;
  } catch (error) {
    return null;
  }
}

export function jsonStringify(
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number,
) {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (error) {
    return '';
  }
}

export function flatten<T>(array: T[]): T[] {
  return array.reduce((pre, current) => {
    return pre.concat(Array.isArray(current) ? flatten(current) : current);
  }, [] as T[]);
}

export function toNum(size: any, defaultVal = 0) {
  return !isNaN(+size) ? +size : defaultVal;
}

export function objectKeys<T, K extends keyof T>(object: T) {
  return Object.keys(object) as K[];
}
