import { hotReloadEvent } from './event';
const { DEV_PORT } = devConfig || {};

const hotLog = (msg: string) => {
  console.log(`[chrome-hot-content]: ${msg}`);
};
hotLog(`当前port:${DEV_PORT}`);
hotLog('热更新监听成功');
hotReloadEvent.on('chromeHotReload', () => {
  hotLog('即将开始刷新content');
  setTimeout(() => {
    // 延迟500ms，避免后台更新时前台也刷新，开启header劫持时会出现crash
    window.location.reload();
  }, 500);
});
