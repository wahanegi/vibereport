import Pluralize from "pluralize";
import isEmpty from "ramda/src/isEmpty";
import React, {Fragment} from "react";
import cup from "../../../../assets/images/cup.svg";
import {rangeFormat} from "../../helpers/helpers";
import {BtnSendMoreShoutouts} from "../../UI/ShareContent";

const ShoutoutAwards = ({
                            timePeriod,
                            sentShoutouts,
                            receivedShoutouts,
                            nextTimePeriod,
                            setShoutOutForm,
                            currentUserShoutouts,
                            emptyShoutouts
                        }) => {
    const hasNextPeriodOrShoutouts = !(nextTimePeriod || isEmpty(currentUserShoutouts.sent))
    const hasAnyShoutouts = (!isEmpty(sentShoutouts) || !isEmpty(receivedShoutouts))

    const timePeriodHeader = nextTimePeriod
        ? `The Most Active Awards for ${rangeFormat(timePeriod)} go to...`
        : 'The Most Active team members are currently...'

    const CupIcon = () => <div className="col-12 col-xxl-2 col-xl-2 col-lg-2 col-md-12 col-sm-12">
        <img src={cup} alt="cup"/>
    </div>

    const ShoutoutCountDisplay = ({firstName, count, gotOrSent}) =>
        <p className='fw-semibold m-0 p-0 text-nowrap'>
            <span className='color-rose'>@</span><span
            className='fw-bold'>{firstName}</span> {gotOrSent} {count} {Pluralize('Shoutout', count)}&nbsp;
        </p>


    const SendMoreShoutouts = () => hasNextPeriodOrShoutouts &&
        <div className='col-12 col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 mb-1'>
            <div className='d-flex justify-content-center flex-column mt-2 mt-xxl-0 mt-xl-0 mt-lg-2 mt-md-2 mt-sm-2'>
                <h5 className='fw-semibold'>It's not too late!</h5>
                <BtnSendMoreShoutouts onClick={() => {
                    setShoutOutForm(true)
                }}/>
            </div>
        </div>

    return hasAnyShoutouts && <div className='row justify-content-center'>
        <div
            className={hasNextPeriodOrShoutouts ? `col-12 col-xxl-8 col-xl-8` : 'col-8'}>
            <div className='row'>
                <CupIcon/>
                <div className="col-12 col-xxl-8 col-xl-8 col-lg-8 col-md-12 col-sm-12">
                    <h5 className='text-center fw-semibold'>{timePeriodHeader}</h5>
                    <h5 className='text-center fw-semibold row'>
                        <div className={'col'} hidden={isEmpty(receivedShoutouts)}>
                            {receivedShoutouts.slice(0, 2).map((shoutout, i) =>
                                <ShoutoutCountDisplay key={i}
                                                      firstName={shoutout.sender.first_name}
                                                      count={shoutout.count}
                                                      gotOrSent="sent"/>
                            )}
                        </div>
                        <div className={'col'} hidden={isEmpty(sentShoutouts)}>
                            {sentShoutouts.slice(0, 2).map((shoutout, i) =>
                                <ShoutoutCountDisplay key={i}
                                                      firstName={shoutout.recipient.first_name}
                                                      count={shoutout.count}
                                                      gotOrSent="got"/>
                            )}
                        </div>
                    </h5>
                </div>
                <CupIcon/>
            </div>
        </div>
        <SendMoreShoutouts/>
    </div>
}

export default ShoutoutAwards
