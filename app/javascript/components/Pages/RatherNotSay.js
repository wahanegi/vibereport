import React, {Fragment, useState} from 'react';
import CornerElements from "../UI/CornerElements";
import Button from "../UI/Button";
import {signOutUser} from "../requests/axios_requests";

const RatherNotSay = ({ data,  setData , saveDataToDb, steps, service, draft}) => {
  const[nextView, setNextView] = useState(false)
  const xCloseData = data.time_period.end_date
    const skipHandling = () => {
    if (nextView) {
            signOutUser(data.response.id).then(() => window.location.href = `/sign_in`);
    }
    else{
        steps.push('productivity-check')
        saveDataToDb(steps, { draft: false })}
    }

    const noHandling = () => {
      if (nextView) {
          setNextView(false)
          steps.push('emotion-selection-web')
          saveDataToDb(steps, { draft: false })}
      else
          setNextView(true)
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
                                    saveDataToDb = {saveDataToDb}
                                    steps = {steps}
                                    draft = {draft}/>
        </Fragment>
    );
};

export default RatherNotSay;