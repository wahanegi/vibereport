import React, {Fragment} from 'react';
import CornerElements from "../../UI/CornerElements";
import Button from "../../UI/Button";

const RatherNotSay = ({ data,  setData , saveDataToDb, steps, service, draft}) => {

  const skipHandling = () =>{
      steps.push('productivity-check')
      saveDataToDb(steps, { draft: false })
  }

  const noHandling = () => {
      steps.push('skip-ahead')
      saveDataToDb(steps, { draft: false })
  }

  return (
      <Fragment>
          <div className='rather-not-say-first-row'>
            <h1> That's okay.</h1>
            <div className='row2 mx-auto'>
              <h2>Would you like to continue <br/> with your check-in?</h2>
            </div>
              <div className='row3'>
                  <Button className='btn-modal c1 btn-wide' onClick={ skipHandling }>Yes, skip ahead</Button>
              </div>
              <div className='row4'>
                  <Button className='btn-modal c1 bg-gray-200 bg-gray-hover-200 btn-no' onClick={ noHandling }>No</Button>
              </div>
          </div>
         <CornerElements         data = { data }
                                  setData = { setData }
                                  saveDataToDb = {saveDataToDb}
                                  steps = {steps}
                                  draft = {draft}/>
      </Fragment>
  );
};

export default RatherNotSay;