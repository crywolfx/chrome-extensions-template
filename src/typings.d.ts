declare module '*.less';
declare module '*.less?toString';
declare module '*.css';
declare const devConfig: {
  HOT_RELOAD_CHROME: boolean;
  DEV_PORT: number;
  VERSION: string;
  DEV_CONFIG: {
    request: {
      [x: string]: {
        target: string;
        headers: Record<string, string>;
      };
    };
  };
};
