import React, {useEffect, useRef} from 'react';

const ListItem = ( props ) => {
  const ref = useRef(null);
  useEffect(() => {
    if (props.focus) {
      ref.current?.focus();
    }
  }, [props.focus]);

  const handleKeyDown = event => {
    let i = props.index
    event.preventDefault()
    switch (event.key){
      case 'Enter':
        props.onClick( props.index )
        break
      case 'ArrowUp':
        console.log(i, props.dataList)
        props.changeIndexSel(i = props.index > 0 ? --i : props.dataList.length - 1)
        props.changeValSel(props.dataList[i].id)
        break
      case 'ArrowDown':
        props.changeIndexSel(i = props.index < props.dataList.length - 1 ? ++i : 0)
        props.changeValSel(props.dataList[i].id)
        break
    }
  }


  const onClickHandling = () =>{
    props.onClick( props.index )
  }

  return (
    <li ref={ref} className={props.className} tabIndex={props.focus ? 0 : -1}
        onClick={ onClickHandling }
        onKeyDown = { handleKeyDown }
    >
      {props.children}
    </li>
  );
};

export default ListItem;