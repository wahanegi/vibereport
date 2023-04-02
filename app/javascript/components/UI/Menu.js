import React from 'react';
import {Dropdown} from "react-bootstrap";
import Button from "./Button";

const Menu = ({ percent_completion }) => {
  return (
    <div style={{position: 'fixed', right: 30, top: 62}}>
      <Dropdown>
        <Dropdown.Toggle  id='dropdown-stick'>
        <div  className="icon-circle menu">
          <div  className="m-cover"></div>
          <div className='one-line-menu'></div>
          <div className='one-line-menu' style={{top:32}}></div>
          <div className='one-line-menu' style= {{top:45}}></div>
        </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#" ><Button className='item-menu wb1 mx-auto my-auto' onClick={()=>{}}>Manage Profile</Button></Dropdown.Item>
          <Dropdown.Item href="#" ><Button className='item-menu wb1  mx-auto my-auto' onClick={()=>{}}>Save Draft</Button></Dropdown.Item>
          <Dropdown.Item href="#" ><Button className='item-menu wb1  mx-auto my-auto' onClick={()=>{}}>Log Out</Button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className='fs-6 text-primary' style={{margin: 19+"px 0 0 0"}}>{percent_completion}% complete</div>
    </div>
  );
};

export default Menu;