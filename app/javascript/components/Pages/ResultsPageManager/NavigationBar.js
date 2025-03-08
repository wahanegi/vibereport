import React, {Fragment} from "react";
import {Calendar, EditResponse, Results} from "../../UI/ShareContent";
import {datePrepare, isBlank, isPresent, rangeFormat} from "../../helpers/helpers";
import isEmpty from "ramda/src/isEmpty";
import {updateResponse} from "../../requests/axios_requests";
import {useNavigate} from "react-router-dom";

const NavigationBar = ({timePeriod, showPrevTimePeriod, showNextTimePeriod, time_periods, prevTimePeriod,
                        nextTimePeriod, steps, emotions, data, setShowWorkingModal, setData, prev_results_path}) => {
  if(isEmpty(time_periods)) return null;

  const notWorking = data.response.attributes.not_working
  const navigate = useNavigate()
  const handlingBack = () => {
    const index = steps.indexOf('emotion-intensity');
    if (notWorking) {
      return setShowWorkingModal(true)
    } else {
      const new_steps = steps.slice(0, index + 1);
      const steps_arr = isEmpty(new_steps) ? ['emotion-selection-web', 'productivity-check'] : new_steps
      const dataRequest = {
        response: {
          attributes: {
            not_working: false,
            draft: false,
            completed_at: null,
            steps: steps_arr
          }
        }
      }
      updateResponse(data, setData, dataRequest, navigate(`/${steps_arr.slice(-1).toString()}`)).then()
    }
  }
  const isPenultimatePeriod = nextTimePeriod?.id === time_periods[0].id

  return <div >
    <div className='d-flex flex-wrap justify-content-center justify-content-md-between w-100 '>
      <Calendar date={isPresent(prevTimePeriod) ? rangeFormat(prevTimePeriod) : datePrepare(timePeriod.start_date)} onClick={showPrevTimePeriod}
                positionLeft={true} prevTimePeriod={prevTimePeriod} emotions={emotions} nextTimePeriod={nextTimePeriod} />
      <div className='d-flex flex-wrap align-items-center justify-content-center me-lg-4'>
      <Results data={data} setData={setData} steps={steps} />
      <Calendar date={isPenultimatePeriod ? datePrepare(nextTimePeriod?.start_date) : rangeFormat(nextTimePeriod)} onClick={showNextTimePeriod}
                positionRight={true} prevTimePeriod={prevTimePeriod} emotions={emotions}
                hidden={isBlank(nextTimePeriod) || (timePeriod.id === time_periods[1].id && isPresent(data.prev_results_path))}/>
      <EditResponse onClick={handlingBack} hidden={nextTimePeriod || isPresent(prev_results_path)} />
      </div>
    </div>
  </div>
}

export default NavigationBar