import React, {Fragment, useEffect} from 'react';
import {BtnBack, BtnNext, Wrapper} from "../UI/ShareContent";
import CornerElements from "../UI/CornerElements";
import Button from "../UI/Button";
import BlockLowerBtns from "../UI/BlockLowerBtns";

const Recognition = ({data, setData, saveDataToDb, steps, service}) => {
  const shoutOuts = ['@Team2 you\'re all doing so awesome! thanks!',
                              '@roger thanks for the help with Project1',
                                '@roger thanks for the help with Project2',
                                  '@roger thanks for the help with Vibe Report Project. ' +
                                   'Significant pleasure to @MarinaHarashko, @LyubaPidoshva, @SerhiiBorozenets']
const numShoutouts = shoutOuts.length


  const skipHandling = () =>{
    steps.push('emotion-selection-web')
    saveDataToDb( steps )
  }

  const nextHandling = () =>{
    steps.push('emotion-selection-web')
    saveDataToDb( steps )
  }

  const output = (shoutOuts) =>{
    return (
      <ul>
      {shoutOuts.map((shoutOut)=>(
      <li className='border-4-primary-radius-18 c3'><p className='fw-semibold mb-0' >{shoutOut}</p></li>
      ))}
      </ul>
    )
  }

  return (
    <Wrapper>
      <div className='mx-auto w746 h59 mt151 mb-4'>
        <h1 className='color-black'>Recognition is important!</h1>
      </div>
        {!numShoutouts && <h2 className='color-black'>
          Consider giving members of your team a <br/>
          Shoutout to show your appreciation.</h2>

        }

      {!!numShoutouts && <div><h2 className='color-black mb-1'>You've mentioned:</h2></div>}
        {!!numShoutouts && <div>
          <div className='d-flex justify-content-center rect884x239 border-4-primary-radius-18 mx-auto'>
            {output(shoutOuts)}
          </div>
          <p className='b3 mt-4 lh-base'>Any more shoutouts to give?</p>
        </div>
        }
      <BlockLowerBtns skipHandling={skipHandling} nextHandling={nextHandling} isNext = { !!numShoutouts } />
      <CornerElements numShoutouts={ numShoutouts } moveShoutout={true}/>
    </Wrapper>
  );
};

export default Recognition;