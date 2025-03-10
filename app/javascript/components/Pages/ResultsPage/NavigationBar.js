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

    return (<div className="col-12 col-xxl-10 col-xl-10 col-lg-10 col-md-11 col-sm-12">
        <div
            className='d-flex flex-column flex-xxl-row flex-xl-row flex-lg-row flex-md-column flex-sm-column align-items-center justify-content-center justify-content-xxl-between justify-content-xl-between justify-content-lg-between w-100 gap-1'>
            <Calendar
                date={isPresent(prevTimePeriod) ? rangeFormat(prevTimePeriod) : datePrepare(timePeriod.start_date)}
                onClick={showPrevTimePeriod}
                positionLeft={true}
                prevTimePeriod={prevTimePeriod}
                emotions={emotions}
                nextTimePeriod={nextTimePeriod}/>
            <div className='d-flex flex-nowrap flex-column flex-xxl-row flex-xl-row flex-lg-row flex-md-column flex-sm-column align-items-center gap-1'>
                {hasTeamAccess && <ResultsManager data={data}
                                                  setData={setData}
                                                  steps={steps}
                                                  nextTimePeriod={nextTimePeriod}/>}

                <Calendar
                    date={isPenultimatePeriod ? datePrepare(nextTimePeriod?.start_date) : rangeFormat(nextTimePeriod)}
                    onClick={showNextTimePeriod}
                    positionRight={true}
                    hidden={isBlank(nextTimePeriod) || (timePeriod.id === time_periods[1].id && isPresent(data.prev_results_path))}
                    prevTimePeriod={prevTimePeriod}
                    emotions={emotions}/>

                <EditResponse onClick={handlingBack}
                              hidden={nextTimePeriod}
                />
            </div>
        </div>
    </div>)
}

export default NavigationBar