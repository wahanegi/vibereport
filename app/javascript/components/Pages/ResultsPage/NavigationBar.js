import React from "react";
import {Calendar, EditResponse} from "../../UI/ShareContent";
import {backHandling, datePrepare, isBlank, isEmpty, isPresent, rangeFormat} from "../../helpers/helpers";

const NavigationBar = ({timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod, nextTimePeriod}) => {
  if(isEmpty(time_periods)) return null
  const isPenultimatePeriod = nextTimePeriod?.id === time_periods[0].id

  return <div className='d-flex justify-content-between' style={{marginLeft: 140, marginRight: 140}}>
    <Calendar date={isPresent(prevTimePeriod) ? rangeFormat(prevTimePeriod) : datePrepare(timePeriod.start_date)} onClick={showPrevTimePeriod}
              positionLeft={true} prevTimePeriod={prevTimePeriod} />
    <Calendar date={isPenultimatePeriod ? datePrepare(nextTimePeriod?.start_date) : rangeFormat(nextTimePeriod)} onClick={showNextTimePeriod}
              positionRight={true} hidden={isBlank(nextTimePeriod)} prevTimePeriod={prevTimePeriod} isPenultimatePeriod={isPenultimatePeriod} />
    <EditResponse onClick={backHandling} hidden={nextTimePeriod} />
  </div>
}

export default NavigationBar