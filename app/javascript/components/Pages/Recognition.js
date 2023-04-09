import React, {Fragment} from 'react';
import {Wrapper} from "../UI/ShareContent";
import CornerElements from "../UI/CornerElements";

const Recognition = ({data, setData, saveDataToDb, steps, service}) => {
  return (
    <Wrapper>
      <div className='mx-auto w746 h59 mt151'>
        <h1 className='color-black'>Recognition is important!</h1>
        <h2 className='color-black'>Consider giving members of your team a <br/>Shoutout to show your appreciation.</h2>
      </div>
      <CornerElements/>
    </Wrapper>
  );
};

export default Recognition;