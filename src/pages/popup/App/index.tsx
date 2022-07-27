import useStore from "@/common/hooks/useStore";
import { chromeEvent } from "@/event";
import { Switch } from "antd";
import { useCallback } from "react";

export default function App () {
  const [checked, setChecked] = useStore('isActive');
  const onChange = useCallback(
    (val: boolean) => {
      setChecked(val);
      chromeEvent.emit('createContent', val, { type: 'tab' });
    },
    [setChecked],
  );
  
  return (
    <div>
      启用插件
      <Switch className="vision-open__switch" checked={checked} onChange={onChange} />
    </div>
  )
}