import Style from '@/components/Shadow/Style';
import type { ReactNode } from 'react';
import { useEffect, useRef, useMemo } from 'react';
import root from 'react-shadow';

export default function ShadowRoot(props: {
  id: string;
  antdComponentUsed?: string[];
  css?: string;
  children?: ReactNode;
  mode?: 'open' | 'closed';
  onCreated?: (s?: ShadowRoot | null) => void;
}) {
  const { antdComponentUsed = [], css, mode = 'open', onCreated } = props;
  const antdCss = useMemo(
    () =>
      antdComponentUsed.map(
        (name) =>
          require('antd/es/' + name.toLocaleLowerCase() + '/style/index.less?toString')?.default,
      ),
    [antdComponentUsed],
  );
  let animate = '';
  if (antdCss.length) {
    animate = require('antd/es/style/index.less?toString')?.default;
  }

  const ref = useRef<HTMLElement>(null);
  const onCreatedRef = useRef(onCreated);
  useEffect(() => {
    onCreatedRef.current = onCreated;
  }, [onCreated]);

  useEffect(() => {
    const shadowRoot = ref.current?.shadowRoot;
    onCreatedRef.current?.(shadowRoot);
  }, []);

  return (
    <root.div ref={ref} id={props.id} mode={mode}>
      <Style styles={[animate, ...antdCss, css]} />
      {props.children}
    </root.div>
  );
}
