import React, {Fragment} from 'react';
import CornerElements from "../UI/CornerElements";
import Button from "../UI/Button";

const RatherNotSay = ({ data,  setData , saveDataToDb, steps, service}) => {
    return (
        <Fragment>
            <div className='rather-not-say-first-row'>
              <h1 className='lh-1'>That's okay.</h1>
              <div className='row2 mx-auto'>
                <h2>Would you like to continue with your check-in?</h2>
              </div>
                <div className='row3'>
                    <Button className='btn-modal c1 btn-yes' onClick={()=>{}}>Yes, skip ahead</Button>
                </div>
                <div className='row4'>
                    <Button className='btn-modal c1 back btn-no' onClick={()=>{}}>No</Button>
                </div>
            </div>

            <CornerElements         data = { data }
                                    setData = { setData }
                                    percentCompletion = {0}/>
        </Fragment>
    );
};

export default RatherNotSay;