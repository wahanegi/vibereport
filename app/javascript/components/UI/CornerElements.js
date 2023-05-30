import React, {Fragment} from 'react';
import QuestionButton from "./QuestionButton";
import ShoutoutButton from "./ShoutoutButton";
import Menu from "./Menu";

const CornerElements = ({
                            data,
                            setData,
                            percentCompletion,
                            numShoutouts = 0,
                            isMoveShoutout }) => {
  return (
    <Fragment>
      <div className="board position-absolute t-35">
        <div className="convert bigger ml-41 " >
          <p className="position-relative color-black" >Logo/Brand</p>
          <div className="line1 offset-line1" ></div>
          <div className="line2 offset-line2"></div>
        </div>
      </div>
      <QuestionButton />
      <ShoutoutButton   data = { data }
                     setData = { setData }
                         num = { numShoutouts }
                   className = ''
                      isMove = { isMoveShoutout }/>
     <Menu percentCompletion = {percentCompletion} className='placement-menu'/>
    </Fragment>
  );
};

export default CornerElements;