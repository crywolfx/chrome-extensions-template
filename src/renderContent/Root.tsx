import ShadowRoot from '@/components/Shadow';
import css from '@/renderContent/style/root.less?toString';
import Home from '@/renderContent/views/Home';

export default function Root () {
  return (
    <ShadowRoot
      id="chromeExtensionTemplateRoot"
      css={css}
      antdComponentUsed={[
        'button',
      ]}
      mode="open"
    >
      <Home />
    </ShadowRoot>
  )
}