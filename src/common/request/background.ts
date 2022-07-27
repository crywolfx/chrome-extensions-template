import { DEV_REQUEST_CONFIG, isProduction } from '../env';
import { isArray, isObject, jsonStringify, parseQuery } from '../utils';
import { deserialize } from './serialize';
import type { RequestInitType } from './type';

type ProxyConfig = typeof DEV_REQUEST_CONFIG[keyof typeof DEV_REQUEST_CONFIG];
/**
 * 匹配原则
 * 优先选更长的
 * 长度相同选index靠后的
 * 长度及index都相同则后面的覆盖前面的(顺序不保证，依赖Object.keys)
 *
 * @param {string} href
 */
const getProxy = (href: string) => {
  let matchLength = 0;
  let matchIndex = 0;
  return Object.keys(DEV_REQUEST_CONFIG).reduce<ProxyConfig | null>((pre, prefix) => {
    const matchInfo = href.match(prefix);
    if (!matchInfo) return pre;
    const currentLength = matchInfo?.[0]?.length || 0;
    const currentIndex = matchInfo.index || 0;
    const currentConfig = DEV_REQUEST_CONFIG[prefix];
    if (currentLength >= matchLength) {
      if (currentLength === matchLength) {
        if (currentIndex >= matchIndex) {
          matchIndex = currentIndex;
          return currentConfig;
        } else {
          return pre;
        }
      }
      matchLength = currentLength;
      matchIndex = currentIndex;
      return currentConfig;
    }
    return pre;
  }, null);
};

export async function request<T>({
  url,
  params = {},
  data,
  method,
  headers,
  ...others
}: RequestInitType) {
  let urlWithQuery = parseQuery(params, url);
  let proxyHeaders = {};
  if (!isProduction) {
    const proxyConfig = getProxy(url);
    if (proxyConfig) {
      proxyHeaders = proxyConfig.headers;
      const urlInfo = new URL(urlWithQuery);
      const devUrlInfo = new URL(proxyConfig.target);
      urlInfo.host = devUrlInfo?.host;
      urlInfo.protocol = devUrlInfo?.protocol;
      urlWithQuery = new URL(urlInfo)!.href;
    }
  }
  
  let formattedData: any = deserialize(data);
  let contentType = {};
  if (isObject(formattedData) || isArray(formattedData)) {
    formattedData = jsonStringify(formattedData);
    contentType = {
      'Content-Type': 'application/json;charset=utf-8',
    };
  }

  return fetch(urlWithQuery, {
    body: formattedData,
    method,
    headers: {
      ...contentType,
      ...headers,
      ...proxyHeaders,
    },
    ...others,
  }).then((r) => (r?.json() as unknown as T));
}
