import { isDef, jsonParse, jsonStringify } from '../utils';

export async function serialize(data: any): Promise<any> {
  const cls = Object.prototype.toString.call(data).slice(8, -1);
  switch (cls) {
    case 'FormData': {
      return {
        cls,
        value: await Promise.all(
          Array.from(data.keys(), async (key) => [
            key,
            await Promise.all(data.getAll(key)?.map?.(serialize)),
          ]),
        ),
      };
    }
    case 'Blob':
    case 'File':
      return new Promise((resolve) => {
        const { name, type, lastModified } = data;
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            cls,
            name,
            type,
            lastModified,
            value: reader.result?.slice?.(String.prototype.indexOf.call(reader.result, ',') + 1),
          });
        reader.readAsDataURL(data);
      });
    default:
      return !isDef(data)
        ? undefined
        : {
            cls: 'Json',
            value: jsonStringify(data),
          };
  }
}

export function deserialize(src: any) {
  if (!src) return undefined;
  switch (src.cls) {
    case 'FormData': {
      const fd = new FormData();
      for (const [key, items] of src.value) {
        for (const item of items) {
          fd.append(key, deserialize(item));
        }
      }
      return fd;
    }
    case 'Blob':
    case 'File': {
      const { type, name, lastModified } = src;
      const binStr = atob(src.value);
      const arr = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) arr[i] = binStr.charCodeAt(i);
      const data = [arr.buffer];
      return src.cls?.toLocaleLowerCase() === 'file'
        ? new File(data, name, { type, lastModified })
        : new Blob(data, { type });
    }
    case 'Json':
      return jsonParse(src.value);
  }
}
