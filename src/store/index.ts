import { ChromeStorage } from 'chrome-extension-core';

export type StorageInfo = {
  isActive: boolean;
};

export const defaultValue: StorageInfo = {
  isActive: false,
};

// 插件环境的全局storage
export const store = new ChromeStorage<StorageInfo>(chrome.storage?.local, defaultValue, {
  scope: 'chromeExtensionsTemplate',
});
