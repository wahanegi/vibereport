import Menu from "../../UI/Menu";
import QuestionButton from "../../UI/QuestionButton";
import ShoutoutButton from "../../UI/ShoutoutButton";
import React from "react";

export const RightPanel = () =>  <div className='col-2 mb-3 text-center'>
  <div className="d-flex align-items-end flex-column mb-3" style={{height: '95vh'}}>
    <div className="p-2">
      <Menu>X% complete</Menu>
    </div>
    <div className="mt-auto p-2">
      <QuestionButton />
    </div>
  </div>
</div>

export const LeftPanel = () => <div className='col-2 mb-3 text-center'>
  <div className="d-flex align-items-end flex-column mb-3" style={{height: '95vh'}}>
    <div className="p-2">
      <div className="convert increased-convert in_left">
        <p>Logo/Brand</p>
        <div className="line1 offset-line1"></div>
        <div className="line2 offset-line2"></div>
      </div>
    </div>
    <div className="mt-auto p-2">
      <ShoutoutButton />
    </div>
  </div>
</div>
