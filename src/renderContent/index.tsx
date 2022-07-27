import React from 'react';
import ReactDOM from 'react-dom';
import Home from '@/renderContent/views/Home';

type Props = {
  container?: Element | null;
};
const render = (props: Props) => {
  const { container } = props;
  if (container) {
    ReactDOM.render(
      <Home></Home>,
      container,
    );
  }
};

export async function mount(props: Props) {
  render(props);
}

export async function unmount(props: Props) {
  const { container } = props;
  container && ReactDOM.unmountComponentAtNode(container);
}
