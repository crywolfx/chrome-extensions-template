import type { StorageInfo } from '@/store';
import { store, defaultValue } from '@/store';
import { useCallback, useEffect, useState } from 'react';

/**
 * 持久化存储store
 */
export default function useStore<Key extends keyof StorageInfo>(
  key: Key,
): [StorageInfo[Key], (newValue: StorageInfo[Key]) => Promise<void>] {
  const [value, setValue] = useState<StorageInfo[Key]>(defaultValue[key]);
  useEffect(() => {
    const getStore = async () => {
      const currentStoreValue = await store.get(key);
      setValue(currentStoreValue);
    };
    const storeWatcher = (data: Record<keyof StorageInfo, chrome.storage.StorageChange>) => {
      if (data[key]) {
        const changedData = data[key];
        setValue(changedData.newValue);
      }
    };
    store.addWatcher(storeWatcher);
    getStore();
    return () => {
      store.removeWatcher(storeWatcher);
    };
  }, [key]);

  const setStore = useCallback(
    (newValue: StorageInfo[Key]) => {
      return store.set(key, newValue);
    },
    [key],
  );

  return [value, setStore];
}
