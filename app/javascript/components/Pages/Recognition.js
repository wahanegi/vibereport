import React, {Fragment, useEffect, useState} from 'react';
import {BtnBack, BtnNext, Wrapper} from "../UI/ShareContent";
import CornerElements from "../UI/CornerElements";
import Button from "../UI/Button";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import parse from 'html-react-parser'
import edit_pencil from "../../../assets/images/edit-pencil.svg";
import ShoutoutModal from "../UI/ShoutoutModal";

const Recognition = ({data, setData, saveDataToDb, steps, service}) => {
  const [ shoutOutForm, setShoutOutForm ] = useState( { status: false, editObj: {}} )

  const shoutOuts = data.my_shout_outs_to_other
      .filter( item => item.time_period_id === data.time_period.id)
      .sort( (a,b) =>  a.updated_at < b.updated_at ? 1 : -1 )

  const numShoutOuts = shoutOuts.length

  const skipHandling = () =>{
    steps.push('recognition')
    saveDataToDb( steps )
  }

  const nextHandling = () =>{
    steps.push('recognition')
    saveDataToDb( steps )
  }
  const editHandling = (e) =>{
    e.preventDefault()

    const editObj = data.my_shout_outs_to_other.find(item => item.id === Number(e.target.attributes.id.value))

    setShoutOutForm( { status: true, editObj: editObj } )
  }

  const closeHandling = () => {
    setShoutOutForm( { status: false, editObj: {} } )
  }


  const output = (shoutOuts) =>{

    return (
      <ul>
      {shoutOuts.map( shoutOut => (
      <li className='c3' key={ shoutOut.id }>
        <span>
          <p className='fw-semibold mb-0  cut-text'>{parse(shoutOut.rich_text)}</p>
        </span>
        <img  id={ shoutOut.id } src={edit_pencil} alt="pencil" onClick={editHandling}/>
      </li>
      ))}
      </ul>
    )
  }

  const cornerElements = (num) => {
    return <CornerElements data = { data }
                        setData = { setData }
              percentCompletion = { 80 }
                   numShoutouts = { num }
                 isMoveShoutout = { true }/>
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
        {!!numShoutOuts &&
            <div>
              {shoutOutForm.status &&
                  <ShoutoutModal onClose = { closeHandling }
                                 data = { data }
                                 setData = { setData }
                                 editObj = { shoutOutForm.editObj } />}
              <div className='d-flex justify-content-center field-shout-outs mx-auto'>
                {output(shoutOuts)}
              </div>
              <p className='b3 mt-4 lh-base'>Any more shoutouts to give?</p>
              { cornerElements( numShoutOuts ) }
            </div>
        }
      <BlockLowerBtns skipHandling={ skipHandling } nextHandling={ nextHandling } isNext = { !!numShoutOuts } />
      {!numShoutOuts && cornerElements( numShoutOuts )}
    </Wrapper>
  );
};

export default Recognition;