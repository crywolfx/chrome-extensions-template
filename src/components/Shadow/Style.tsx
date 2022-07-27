export default function Style(props: { styles: any[] }) {
  return (
    <>
      {props.styles?.map?.((item, key) => {
        return item ? (
          // eslint-disable-next-line react/no-array-index-key
          <style type="text/css" key={key}>
            {item?.toString?.()}
          </style>
        ) : null;
      })}
    </>
  );
}
