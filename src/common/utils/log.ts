import { jsonStringify } from './type';

export const BASE_NAME = '[chrome-extensions]';

export const msg2plainText = (msg: any) => `${msg instanceof Object ? jsonStringify(msg) : msg}`;

export const formatMessage = (msg: any) => `${BASE_NAME}：${msg2plainText(msg)}`;

export const contentLog = (
  msg: any,
  options?: {
    value?: any;
    type?: 'log' | 'error';
  },
) => {
  const type = options?.type || 'log';
  console[type](
    `%c${BASE_NAME}`,
    'color: #43bb88;font-size: 16px;font-weight: bold;text-decoration: underline;',
    msg2plainText(msg),
    options?.value || '',
  );
};
