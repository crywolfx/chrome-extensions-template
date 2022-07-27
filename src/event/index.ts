import { Event } from 'chrome-extension-core';
import type { RequestInitType } from '@/common/request/type';

type EventInfo = {
  request: RequestInitType;
  createContent: boolean;
};

export const chromeEvent = new Event<EventInfo>('chromeExtensionsTemplate');
