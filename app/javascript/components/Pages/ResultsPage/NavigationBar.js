import React from "react";
import {Calendar, EditResponse} from "../../UI/ShareContent";
import {backHandling, datePrepare, isBlank, isEmpty, isPresent, lastEl, rangeFormat} from "../../helpers/helpers";

const NavigationBar = ({timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod, nextTimePeriod}) => {
  if(isEmpty(time_periods)) return null

  return <div className='d-flex justify-content-between' style={{marginLeft: 140, marginRight: 140}}>
    <Calendar date={isPresent(prevTimePeriod) ? rangeFormat(prevTimePeriod) : datePrepare(timePeriod.start_date)} onClick={showPrevTimePeriod}
              positionLeft={true} prevTimePeriod={prevTimePeriod} />
    <Calendar date={isPresent(prevTimePeriod) && isPresent(nextTimePeriod) ? rangeFormat(nextTimePeriod) : datePrepare(timePeriod.end_date)} onClick={showNextTimePeriod}
              positionRight={true} hidden={isBlank(nextTimePeriod)} prevTimePeriod={prevTimePeriod} />
    <EditResponse onClick={backHandling} hidden={nextTimePeriod} />
  </div>
}

export default NavigationBar