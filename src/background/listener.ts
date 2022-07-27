import { request } from '@/common/request/background';
import type { RequestInitType } from '@/common/request/type';
import { chromeEvent } from '@/event';

(globalThis as any).__is__init__background__request__vision__ = false;
/**
 * 初始化请求监听
 * 在background里执行
 * @export
 */
export function initBackgroundRequest() {
  // 避免重复监听
  if (!(globalThis as any)?.__is__init__background__request__vision__) {
    (globalThis as any).__is__init__background__request__vision__ = true;
    chromeEvent.on('request', async (reqeustInit: RequestInitType) => {
      try {
        const res = await request(reqeustInit);
        return { success: true, data: res, message: 'success' };
      } catch (error) {
        return { success: false, data: error, message: 'error' };
      }
    });
  }
}
