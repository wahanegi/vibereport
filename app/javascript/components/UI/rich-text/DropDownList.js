import React from 'react';
import ListItem from "./ListItem";
import {userFullName} from "../../helpers/library";

const DropDownList = ({ dataList,  coordX, coordY, onClick, valSel, changeIndexSel, changeValSel }) => {

  return (
    <div className='d-flex position-absolute translate-middle-y start-1 top-1' style={{zIndex:350}}>
      <ul className="drop-down-block lh-base border border-3 border-primary rounded-4 bg-white">
        {dataList.map(( item, index ) => (
          <ListItem
            key = { item.id }
            id = { item.id }
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