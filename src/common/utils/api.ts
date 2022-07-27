import { jsonStringify } from './type';

export const getErrorMsg = (e: any, defaultMsg = '出错了，请稍后再试！'): string => {
  const message =
    e?.errorMsg ||
    e?.error_msg ||
    e?.error ||
    e?.message ||
    e?.desc ||
    jsonStringify(e) ||
    defaultMsg;
  return message;
};
