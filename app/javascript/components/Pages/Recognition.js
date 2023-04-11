import React, {Fragment, useEffect} from 'react';
import {Wrapper} from "../UI/ShareContent";
import CornerElements from "../UI/CornerElements";

const Recognition = ({data, setData, saveDataToDb, steps, service}) => {
const numShoutouts = 0

  return (
    <Wrapper>
      <div className='mx-auto w746 h59 mt151'>
        <h1 className='color-black'>Recognition is important!</h1>
        <h2 className='color-black'>Consider giving members of your team a <br/>Shoutout to show your appreciation.</h2>
      </div>

      <CornerElements numShoutouts={numShoutouts} moveShoutout={true}/>
    </Wrapper>
  );
};

export default Recognition;