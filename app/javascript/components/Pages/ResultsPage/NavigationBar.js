import React from "react";
import {Calendar, EditResponse} from "../../UI/ShareContent";
import {backHandling, isEmpty, lastEl} from "../../helpers/helpers";

const NavigationBar = ({timePeriod, prevTimePeriod, nextTimePeriod, timePeriodIndex, time_periods}) => {
  if(isEmpty(time_periods)) return null

  return <div className='d-flex justify-content-between' style={{marginLeft: 140, marginRight: 140}}>
    <Calendar date={timePeriod.start_date} onClick={prevTimePeriod} positionLeft={true} hideLeft={timePeriod.id === lastEl(time_periods).id} />
    <Calendar date={timePeriod.end_date} onClick={nextTimePeriod} positionRight={true} hidden={timePeriodIndex === 0} />
    <EditResponse onClick={backHandling} hidden={timePeriodIndex !== 0} />
  </div>
}

export default NavigationBar