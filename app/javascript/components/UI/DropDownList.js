import React from 'react';
import ListItem from "./ListItem";
import {userFullName} from "../helpers/library";

const DropDownList = ({ dataList,  coordX, coordY, onClick, valSel, changeIndexSel, changeValSel }) => {

  return (
    <div className='position-absolute' style={{zIndex:350,  top: coordY, left: coordX }}>
      <ul className="drop-down-block lh-base">
        {dataList.map(( item ,index ) => (
          <ListItem
            key = { item.id }
            dataList = { dataList }
            index = { index }
            className = {`item b3 ${valSel === item.id ? 'highlight' : ''}`}
            focus = {valSel === item.id }
            onClick = { onClick }
            changeIndexSel={ changeIndexSel }
            changeValSel={ changeValSel }
          >
            {userFullName(item)}
          </ListItem>
        ))}
      </ul>
    </div>
  );
};

export default DropDownList;