import {
  initBackgroundRequest,
} from './listener';
export { initBackgroundRequest } from './listener';

/**
 * 整体初始化
 */
export const initBackground = () => {
  initBackgroundRequest();
};

initBackground();

