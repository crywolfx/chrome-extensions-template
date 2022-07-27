import { url } from '@/common/regExp';

export const isUrl = (urlString: string) => url.test(urlString);

/**
 * 删除链接中？号后的所有
 */
export const getCleanedHref = (href = window.location.href) => {
  return href.split('?')?.shift?.();
};

export const getHrefWithoutHash = (href = window.location.href) => {
  const _url = new URL(href);
  return _url ? `${_url.origin}${_url.pathname}${_url.search}` : href;
};
