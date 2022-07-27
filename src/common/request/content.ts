import path from 'path';
import type { GetInit, RequestInitType } from './type';
import { chromeEvent } from '@/event';
import { contentLog, isUrl, withTimeout } from '../utils';
import { serialize } from './serialize';

const baseConfig: Pick<RequestInitType, 'showError'> = {
  showError: true,
};

function createService({
  baseUrl = '',
  formatResponse,
  timeout = 20000,
}: {
  baseUrl?: string | Promise<string>;
  formatResponse?: <K>(data: any, config: RequestInitType) => K;
  timeout?: number;
} = {}) {
  async function request<T>(data: RequestInitType) {
    const _baseUrl = await baseUrl;
    data.url = isUrl(data.url) ? data.url : path.join(_baseUrl, data.url);
    const formatData = await serialize(data.data);
    const requestBody = { ...data, data: formatData };
    contentLog('request', { value: requestBody });
    const fetch = () =>
      chromeEvent.emit('request', requestBody).then((res) => {
        if (res?.success)
          return formatResponse
            ? formatResponse<T>(res.data, { ...baseConfig, ...data })
            : (res.data as T);
        return Promise.reject(res?.data);
      });
    return withTimeout(fetch, timeout)
      .then((res) => {
        contentLog('response', { value: res });
        return res;
      })
      .catch((error) => {
        contentLog('responseError', { value: error, type: 'error' });
        return Promise.reject(error);
      });
  }

  function get<T>(getInitValue: GetInit) {
    return request<T>({ ...getInitValue, method: 'GET' });
  }

  function post<T>(postInitValue: RequestInitType) {
    return request<T>({ ...postInitValue, method: 'POST' });
  }

  return { request, get, post };
}

export default createService;
