import { Event } from 'chrome-extension-core';

type EventInfo = {
  chromeHotReload: boolean;
};

export const hotReloadEvent = new Event<EventInfo>('hotReload');
