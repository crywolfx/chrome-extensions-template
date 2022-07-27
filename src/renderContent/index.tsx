import { createRoot, Root } from 'react-dom/client';
import RootComponent from './Root';

type Props = {
  container?: Element | null;
};
let root: Root;
const render = (props: Props) => {
  const { container } = props;
  if (container) {
    root = createRoot(container); 
    root.render(<RootComponent />);
  }
};

export async function mount(props: Props) {
  render(props);
}

export async function unmount(props: Props) {
  const { container } = props;
  const _root = root || (container && createRoot(container));
  _root?.unmount();
}
