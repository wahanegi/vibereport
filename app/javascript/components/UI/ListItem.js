import React, {useEffect, useRef} from 'react';

const ListItem = (props) => {
  const ref = useRef(null);
  useEffect(() => {
    if (props.focus) {
      //console.log("focus on the DropdownList")//ref
      ref.current?.focus();
    }
  }, [props.focus]);
  return (
    <li ref={ref} className={props.className} tabIndex={props.focus ? 0 : -1}
        onClick={() => {}}>
      {props.children}
    </li>
  );
};

export default ListItem;