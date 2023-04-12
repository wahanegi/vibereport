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
                                   'Significant pleasure to @Marina Harashko, @Lyuba Pidoshva, @Serhii Borozenets']
const numShoutOuts = shoutOuts.length


  const skipHandling = () =>{
    steps.push('emotion-selection-web')
    saveDataToDb( steps )
  }

  const nextHandling = () =>{
    steps.push('emotion-selection-web')
    saveDataToDb( steps )
  }

  const output = (shoutOuts) =>{
    const redLighting = (text) => {
      const start = text.indexOf('@')
      let end   = text.indexOf(' ', start)
      if (text[end+1].match(/[A-Z]/)) { end = text.indexOf(' ', end + 1) }
    }
    return (
      <ul>
      {shoutOuts.map( shoutOut => (
      <li className='c3'><p className='fw-semibold mb-0'>{shoutOut}</p></li>
      ))}
      </ul>
    )
  }

  return (
    <Wrapper>
      <div className='mx-auto w-746 h-59 mt-151 mb-4'>
        <h1 className='color-black'>Recognition is important!</h1>
      </div>
        {!numShoutOuts && <h2 className='color-black'>
          Consider giving members of your team a <br/>
          Shoutout to show your appreciation.</h2>

        }

      {!!numShoutOuts && <div><h2 className='color-black mb-1'>You've mentioned:</h2></div>}
        {!!numShoutOuts && <div>
          <div className='d-flex justify-content-center field-shout-outs mx-auto'>
            {output(shoutOuts)}
          </div>
          <p className='b3 mt-4 lh-base'>Any more shoutouts to give?</p>
        </div>
        }
      <BlockLowerBtns skipHandling={skipHandling} nextHandling={nextHandling} isNext = { !!numShoutOuts } />
      <CornerElements numShoutouts={ numShoutOuts } moveShoutout={true}/>
    </Wrapper>
  );
};

export default Recognition;