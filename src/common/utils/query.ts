export const getUrlQueryObj = (url: string): Record<string, any> | null => {
  if (!url) return null;
  const searchStr = url.split('?')?.pop?.() || url;
  const searchList = searchStr.split('&');
  return searchList.length > 0
    ? searchList.reduce((pre, current) => {
        const currentKeyAndValue = current.split('=');
        if (currentKeyAndValue && currentKeyAndValue.length > 1) {
          const key = currentKeyAndValue?.[0];
          const value = currentKeyAndValue?.[1];
          if (key) {
            pre[key] = value.toString();
          }
        }
        return pre;
      }, {} as any)
    : null;
};

export const parseQuery = (object: Record<string, any>, url: string): string => {
  const urlNoQuery = url.split('?')?.[0];
  const urlQuery = url.split('?')?.[1];
  const newObject = { ...getUrlQueryObj(urlQuery), ...object };
  const query: string = Object.keys(newObject).reduce((str: string, key: string) => {
    return `${str}${str ? '&' : ''}${key}=${newObject[key]}`;
  }, '');
  return `${urlNoQuery}${query ? '?' : ''}${query}`;
};
