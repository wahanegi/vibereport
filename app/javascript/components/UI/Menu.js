import React from 'react';

const Menu = ({ percent_completion }) => {
  return (
    <div>
      <div  className="icon-circle menu">
        <div  className="m-cover"></div>
        <div className='one-line-menu'></div>
        <div className='one-line-menu'></div>
        <div className='one-line-menu'></div>
      </div>
      <p style={{margin: 19+"px 0 0 0"}}>{percent_completion}% complete</p>
    </div>
  );
};

export default Menu;