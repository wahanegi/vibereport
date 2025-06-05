import React from "react";
import Pluralize from "pluralize";
import isEmpty from "ramda/src/isEmpty";
import cup from "../../../../assets/images/cup.svg";
import {rangeFormat} from "../../helpers/helpers";
import {BtnSendMoreShoutouts} from "../../UI/ShareContent";
import { userFullName } from "../../helpers/library";

const ShoutoutAwards = ({
                            timePeriod,
                            sentShoutouts,
                            receivedShoutouts,
                            nextTimePeriod,
                            setShoutOutForm,
                            currentUserShoutouts,
                        }) => {
    const isEmptyReceivedShoutouts = isEmpty(receivedShoutouts)
    const isEmptySentShoutouts = isEmpty(sentShoutouts)
    const hasNextPeriodOrShoutouts = !(nextTimePeriod || isEmpty(currentUserShoutouts.sent))
    const hasAnyShoutouts = (!isEmptySentShoutouts || !isEmptyReceivedShoutouts)

    const timePeriodHeader = nextTimePeriod
        ? `The Most Active Awards for ${rangeFormat(timePeriod)} go to...`
        : 'The Most Active team members are currently...'

    const CupIcon = () => <div className="col px-0">
        <img src={cup} alt="cup"/>
    </div>

    const ShoutoutCountDisplay = ({firstName, count, gotOrSent}) =>
        <p className='fw-semibold m-0 p-0 text-nowrap'>
            <span className='fw-bold'>{firstName}</span> {gotOrSent} {count} {Pluralize('Shoutout', count)}&nbsp;
        </p>


    const SendMoreShoutouts = () => hasNextPeriodOrShoutouts &&
        <div className='col-12 col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 mb-1 px-0' style={{maxWidth: '310px'}}>
            <div className='d-flex justify-content-center flex-column mt-2 mt-xxl-0 mt-xl-0 mt-lg-2 mt-md-2 mt-sm-2'>
                <h5 className='fw-semibold'>It's not too late!</h5>
                <BtnSendMoreShoutouts onClick={() => {
                    setShoutOutForm(true)
                }}/>
            </div>
        </div>

    return hasAnyShoutouts && <div className='row justify-content-center px-0'>
        <div
            className={hasNextPeriodOrShoutouts ? `col-12 col-xxl-8 col-xl-8 px-0 mb-1` : 'col-8 px-0 mb-1'}>
            <div className='row px-0'>
                <CupIcon/>
                <div className="col-12 col-xxl-9 col-xl-8 col-lg-8 col-md-12 col-sm-12 px-1 px-xxl-0 px-xl-0 px-lg-0 px-md-1 px-sm-2">
                    <h5 className='text-center fw-semibold' style={{marginBottom: '.8rem'}}>{timePeriodHeader}</h5>
                    <h5 className='text-center fw-semibold row px-0'>
                        <div className='col px-0 mb-1' hidden={isEmptyReceivedShoutouts}>
                            {receivedShoutouts.slice(0, 2).map((shoutout, i) =>
                                <ShoutoutCountDisplay key={i}
                                                      firstName={userFullName(shoutout.sender)}
                                                      count={shoutout.count}
                                                      gotOrSent="sent"/>
                            )}
                        </div>
                        <div className='col px-0' hidden={isEmptySentShoutouts}>
                            {sentShoutouts.slice(0, 2).map((shoutout, i) =>
                                <ShoutoutCountDisplay key={i}
                                                      firstName={userFullName(shoutout.recipient)}
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
