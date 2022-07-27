export const VERSION = devConfig.VERSION;

const { DEV_CONFIG } = devConfig;

export const isProduction = process.env.NODE_ENV === 'production';

export const DEV_REQUEST_CONFIG = DEV_CONFIG.request || {};