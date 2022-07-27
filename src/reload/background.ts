import { debounce } from '@/common/utils/function';
import { getTab } from 'chrome-extension-core';
import { hotReloadEvent } from './event';

const { DEV_PORT } = devConfig || {};
const hotLog = (msg: string) => {
  console.log(`[chrome-hot-background]: ${msg}`);
};

hotLog(`当前port:${DEV_PORT}`);

if (DEV_PORT) {
  const eventSource = new EventSource(`http://127.0.0.1:${DEV_PORT}/reload/`);
  const onMessage = async () => {
    hotLog('接收到reload消息');
    const tabInfo = await getTab({ active: true });
    hotReloadEvent.emit('chromeHotReload', true, { type: 'tab', id: tabInfo?.id }).finally(() => {
      chrome.runtime?.reload?.();
      hotLog('更新成功');
    });
  };
  eventSource.onopen = () => {
    hotLog('建立连接');
  };
  eventSource.onmessage = debounce(onMessage, 1000);
  eventSource.onerror = () => {
    hotLog('连接中断');
  };
}
