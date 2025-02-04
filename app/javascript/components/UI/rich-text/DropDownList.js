import React from 'react';
import ListItem from "./ListItem";
import {userFullName} from "../../helpers/library";

const DropDownList = ({ dataList,  coordX, coordY, onClick, valSel, changeIndexSel, changeValSel }) => {

  return (
    <div className='position-absolute' style={{zIndex:350,  top: coordY, left: coordX }}>
      <ul className="drop-down-block lh-base rounded-3 border border-3 border-primary py-1 ps-0 pe-2 bg-white">
        {dataList.map(( item ,index ) => (
          <ListItem
            key = { item.id }
            id = { item.id }
            dataList = { dataList }
            index = { index }
            className = {`fs-5 list-unstyled text-gray-300 ${valSel === item.id ? 'highlight' : ''}`}
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