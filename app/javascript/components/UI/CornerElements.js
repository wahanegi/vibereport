import React, {Fragment} from 'react';
import QuestionButton from "./QuestionButton";
import ShoutoutButton from "./ShoutoutButton";
import Menu from "./Menu";

const CornerElements = ({ percentCompletion, shoutoutsIntoCenterX2_5 }) => {
  return (
    <Fragment>
      <div className="board position-absolute t35">
        <div className="convert bigger ml-41 " >
          <p className="position-relative lh15-mb-6 color-black" >Logo/Brand</p>
          <div className="line1 offset-line1" ></div>
          <div className="line2 offset-line2"></div>
        </div>
      </div>
      <QuestionButton />
      <ShoutoutButton shoutoutsIntoCenterX2_5={shoutoutsIntoCenterX2_5}/>
      <Menu percentCompletion={percentCompletion} />
    </Fragment>
  );
};

export default CornerElements;