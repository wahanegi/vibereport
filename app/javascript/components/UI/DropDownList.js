import React, {useEffect, useState} from 'react';
import ListItem from "./ListItem";
import {firstLastName} from "../helpers/library";

const DropDownList = ({ dataList, current, coordX = 400, coordY = 400}) => {

  return (
    <div className='position-absolute' style={{zIndex:350,  top: coordY, left: coordX }}>
      <ul className="drop-down-block lh-base">
        {dataList.map((item) => (
          <ListItem
            key={item.id}
            className = {`item b3 ${current === item.id ? 'highlight' : ''}`}
            focus={current === item.id }>
            {firstLastName(item)}
          </ListItem>
        ))}
      </ul>
    </div>
  );
};

export default DropDownList;