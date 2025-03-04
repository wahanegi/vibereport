import isEmpty from "ramda/src/isEmpty";
import React from "react";
import {useNavigate} from "react-router-dom";
import {datePrepare, isBlank, isPresent, rangeFormat} from "../../helpers/helpers";
import {updateResponse} from "../../requests/axios_requests";
import {Calendar, EditResponse, ResultsManager} from "../../UI/ShareContent";

const NavigationBar = ({
                         timePeriod, showPrevTimePeriod, showNextTimePeriod,
                         time_periods, prevTimePeriod, nextTimePeriod,
                         steps, emotions, data, setShowWorkingModal, setData
                       }) => {

  if (isEmpty(time_periods)) return null;

  const notWorking = data.response.attributes.not_working
  const hasTeamAccess = data.has_team_access;

  const navigate = useNavigate()

  const handlingBack = () => {
    if (isPresent(data.prev_results_path)) return;

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

  return (
    <div className='d-flex justify-content-between px-5 w-100 mb-1 mb-md-0'>
      <Calendar date={isPresent(prevTimePeriod) ? rangeFormat(prevTimePeriod) : datePrepare(timePeriod.start_date)} onClick={showPrevTimePeriod}
                positionLeft={true} prevTimePeriod={prevTimePeriod} emotions={emotions} nextTimePeriod={nextTimePeriod}/>
      {hasTeamAccess && <ResultsManager data={data} setData={setData} steps={steps} nextTimePeriod={nextTimePeriod}/>}
      <Calendar date={isPenultimatePeriod ? datePrepare(nextTimePeriod?.start_date) : rangeFormat(nextTimePeriod)} onClick={showNextTimePeriod}
                positionRight={true} hidden={isBlank(nextTimePeriod) || (timePeriod.id === time_periods[1].id && isPresent(data.prev_results_path))} prevTimePeriod={prevTimePeriod} emotions={emotions}/>
      <EditResponse onClick={handlingBack} hidden={nextTimePeriod}/>
    </div>
  )
}

export default NavigationBar