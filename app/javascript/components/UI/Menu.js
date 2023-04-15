import React from 'react';
import {Dropdown} from "react-bootstrap";
import Button from "./Button";

const Menu = ({ percentCompletion, className = ''  }) => {
  return (
    <div className={ `${className}` }>
      <Dropdown>
        <Dropdown.Toggle  id='dropdown-stick'>
        <div  className="menu ">
          <div  className="m-cover  justify-content-end"></div>
          <div className='one-line-menu'></div>
          <div className='one-line-menu'></div>
          <div className='one-line-menu'></div>
        </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#" ><Button className='btn-item-menu wb1 mx-auto my-auto' onClick={()=>{}}>Manage Profile</Button></Dropdown.Item>
          <Dropdown.Item href="#" ><Button className='btn-item-menu wb1  mx-auto my-auto' onClick={()=>{}}>Save Draft</Button></Dropdown.Item>
          <Dropdown.Item href="#" ><Button className='btn-item-menu wb1  mx-auto my-auto' onClick={()=>{}}>Log Out</Button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className='fs-6 text-primary' style={{margin: 19+"px 0 0 0"}}>{percentCompletion}% complete</div>
    </div>
  );
};

export default Menu;