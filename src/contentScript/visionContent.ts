import { VERSION } from '@/common/env';
import { retry, withTimeout } from '@/common/utils';
import { contentLog } from '@/common/utils/log';
import { chromeEvent } from '@/event';
import { mount, unmount } from '@/renderContent';
import { store } from '@/store';

export const getIsActive = () => retry(() => withTimeout(() => store.get('isActive'), 2000), 1);

class Content {
  container: HTMLDivElement | undefined;
  id: string;
  constructor() {
    this.id = `chrome-extensions-template-${VERSION.split('.')?.join?.('-')}`;
  }
  create() {
    if (!this.container && !this.getContainer()) {
      this.container = document.createElement('div');
      this.container.id = this.id;
      document.body.appendChild(this.container);
      mount({ container: this.container });
      contentLog('create成功');
    } else {
      contentLog('当前已存在，无需create');
    }
  }

  destroy() {
    const container = this.container || this.getContainer();
    if (container) {
      unmount({ container });
      this.container?.parentNode?.removeChild(container);
      this.container = undefined;
      contentLog('destory成功');
    }
  }

  private getContainer() {
    return document.querySelector(`#${this.id}`);
  }
}

async function listener(content: Content) {
  chromeEvent.on('createContent', (needSet) => {
    if (needSet) {
      contentLog('接收到create消息');
      content.create();
    } else {
      contentLog('接收到destory消息');
      content.destroy();
    }
  });
}

export function init() {
  if ((window as any)?._vision_content_) {
    return (window as any)?._vision_content_;
  }
  contentLog('代码加载成功, 当前版本:' + VERSION);
  const content = new Content();
  (window as any)._vision_content_ = content;
  getIsActive()
    .then((isActive) => {
      if (isActive) {
        contentLog('全局开关已开启，自动加载');
        content.create();
      } else {
        contentLog('全局开关已关闭，自动卸载');
        content.destroy();
      }
    })
  listener(content);
  return content;
}
