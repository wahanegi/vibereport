import React, {Fragment} from "react";
import {Calendar, EditResponse} from "../../UI/ShareContent";
import {datePrepare, isBlank, isPresent, rangeFormat} from "../../helpers/helpers";
import isEmpty from "ramda/src/isEmpty";

const NavigationBar = ({timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod,
                        nextTimePeriod, steps, saveDataToDb, emotions, data, setShowWorkingModal}) => {
  if(isEmpty(time_periods)) return null;

  const notWorking = data.response.attributes.not_working
  const handlingBack = () => {
    const index = steps.indexOf('emotion-intensity');
    if (notWorking) {
      return setShowWorkingModal(true)
    } else {
      const new_steps = steps.slice(0, index + 1);
      const steps_arr = isEmpty(new_steps) ? ['emotion-selection-web', 'productivity-check'] : new_steps
      saveDataToDb(steps_arr, {not_working: false, draft: false, completed_at: null} )
    }
  }
  const isPenultimatePeriod = nextTimePeriod?.id === time_periods[0].id

  return <Fragment>
    <div className='d-flex justify-content-between position-relative' style={{marginLeft: 172, marginRight: 172, top: 40}}>
      <Calendar date={isPresent(prevTimePeriod) ? rangeFormat(prevTimePeriod) : datePrepare(timePeriod.start_date)} onClick={showPrevTimePeriod}
                positionLeft={true} prevTimePeriod={prevTimePeriod} emotions={emotions} nextTimePeriod={nextTimePeriod} />
      <Calendar date={isPenultimatePeriod ? datePrepare(nextTimePeriod?.start_date) : rangeFormat(nextTimePeriod)} onClick={showNextTimePeriod}
                positionRight={true} hidden={isBlank(nextTimePeriod)} prevTimePeriod={prevTimePeriod} emotions={emotions}/>
      <EditResponse onClick={handlingBack} hidden={nextTimePeriod} />
    </div>
  </Fragment>
}

export default NavigationBar