import React, {Fragment, useState} from 'react';
import CornerElements from "../../UI/CornerElements";
import Button from "../../UI/Button";
import {signOutUser} from "../../requests/axios_requests";
import {redirect} from "react-router-dom";

const RatherNotSay = ({ data,  setData , saveDataToDb, steps, service, draft}) => {
  const xCloseData = data.time_period.end_date

    const reformatData = (date) => {
      let dt = new Date(date)
      let options = { day: '2-digit', month: 'short', year: 'numeric' }
      return new Intl.DateTimeFormat('en-GB', options).format(dt)
    }

  const logoutHandling = () =>{
      steps.push('emotion-selection-web')
      saveDataToDb(steps, { draft: false })
      redirect( window.location.href = `/sign_in`);
  }

  const backHandling = () => {
      steps.push('emotion-selection-web')
      saveDataToDb(steps, { draft: false })
  }

  return (
      <Fragment>
          <div className='rather-not-say-first-row'>
            <h1>We'll be here...</h1>
            <div className='row2 mx-auto'>
              <h2>{`Feel free to return to this check-in\n before it closes on ${reformatData(xCloseData)}`}</h2>
            </div>
              <div className='row3'>
                  <Button className='btn-modal c1 btn-wide' onClick={ logoutHandling }>Ok, log out</Button>
              </div>
              <div className='row4'>
                  <Button className='btn-modal c1 back btn-wide'
                          onClick={ backHandling }>Back to check-in</Button>
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