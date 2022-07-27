import type { WatcherCallback } from 'chrome-extension-core';
import type { StorageInfo } from '@/store';
import { store } from '@/store';
import { useEffect } from 'react';

export default function useStoreWatcher(
  callback: WatcherCallback<StorageInfo>,
  deps?: (keyof StorageInfo)[],
) {
  useEffect(() => {
    const storeWatcher = (data: Record<keyof StorageInfo, chrome.storage.StorageChange>) => {
      const dataKeys = Object.keys(data);
      if (!deps || deps.some((val) => dataKeys.includes(val))) {
        callback(data);
      }
    };
    store.addWatcher(storeWatcher);
    return () => {
      store.removeWatcher(storeWatcher);
    };
  }, [callback, deps]);
}
