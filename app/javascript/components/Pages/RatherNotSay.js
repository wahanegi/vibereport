import React, {Fragment, useState} from 'react';
import CornerElements from "../UI/CornerElements";
import Button from "../UI/Button";

const RatherNotSay = ({ data,  setData , saveDataToDb, steps, service}) => {
  const[nextView, setNextView] = useState(false)
  const xCloseData = "2023-06-25"
    const skipHandling = () => {
    if (nextView) {
      // LOG OUT
    }
    else{
        steps.push('productivity-check')
        saveDataToDb(steps)}
    }

    const noHandling = () => {
    nextView ?   setNextView(false) : setNextView(true)
    }
    return (
        <Fragment>
            <div className='rather-not-say-first-row'>
              <h1>{nextView ?  "We'll be here..." : "That's okay."}</h1>
              <div className='row2 mx-auto'>
                <h2>{nextView ? `Feel free to return to this check-in before it closes on ${xCloseData}`:
                  "Would you like to continue with your check-in?"}</h2>
              </div>
                <div className='row3'>
                    <Button className='btn-modal c1 btn-wide' onClick={ skipHandling }>
                      {nextView ? "Ok, log out" :"Yes, skip ahead"}
                        </Button>
                </div>
                <div className='row4'>
                    <Button className={`btn-modal c1 back ${nextView ?'btn-wide':'btn-no'}`} onClick={noHandling}>
                      {nextView ? "Back to check-in" :"No"}
                    </Button>
                </div>
            </div>

            <CornerElements         data = { data }
                                    setData = { setData }
                                    percentCompletion = {0}/>
        </Fragment>
    );
};

export default RatherNotSay;