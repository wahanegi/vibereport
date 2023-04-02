import React, {Fragment, useEffect, useState} from "react"
import Button from "../UI/Button"
import {useNavigate} from "react-router-dom";
import ShoutoutIcon from "../../../assets/svg/shoutout.svg";
import {Dropdown} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";

const MemeSelection = ({data, setData, saveDataToDb, steps, service}) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {isLoading1, error, setIsLoading1} = service

  const handlingOnClickSkip = () =>{
    steps.push('FollowUpPosWordOnly')
    saveDataToDb( steps ,{})
    }

  const chooseGIPHYHandling=()=>{
    steps.push('SelectedGIPHYFollow')
    saveDataToDb( steps ,{})
  }
  const uploadGIPHYHandling=()=>{
    steps.push('OwnMemeUploadFollow')
    saveDataToDb( steps ,{})
  }

  useEffect(()=>{
      navigate(`/${data.response.attributes.steps.slice(-1).toString()}`);
  },[])
// id:"2.0", step: "meme-selection"
  return(
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error &&
      <div>
        <h1>{data.emotion.word}</h1>
        <div>uhgljkg iohgoensg etgoietjgoiejgetjgioteiogttgijptjjtijt
        oiugoitjoitjto;j dhfhjmtm fdhjmf ghjymutj tyfjryjtn tyjytjty
        iojoitjbmt;jmot fhjyjt fjtjtyjt fjyjutjd yfjtyjmtudm ytjjtyjhd
        iojboirtj[trjmb'[rm ydjytjmt tyjytdjyt dtyjtdm dtyjtujdd dtyjdtyjtd
        oijoitejmt;ojte hjfg sthjtdyjtk argyhtsrjse aeryrjs</div>
        <h2>{data.emotion.word}</h2>
        <h1>{data.emotion.word}</h1>
        <div className=' row'>
          <span className='col b2 m-1 p-1'>1</span >
          <span className='col'>2</span>
          <span className='col'>3</span>
          <span className='col'>4</span>
          <span className='col'>5</span>
          <span className='col'>6</span>
          <span className='col'>7</span>
          <span className='col'>8</span>
          <span className='col'>9</span>
          <span className='col'>10</span>
          <span className='col'>11</span>
          <span className='col'>12</span>
        </div>

        <div className='col-6 offset-3 d-flex justify-content-center'>
          <Button className='bubbles positive wb1' onClick={chooseGIPHYHandling}>excellent</Button>
          <Button className='bubbles positive wb1' onClick={chooseGIPHYHandling}>excellent</Button>
          <Button className='bubbles neutral wb1' onClick={chooseGIPHYHandling}>so so</Button>
          <Button className='bubbles neutral wb1' onClick={chooseGIPHYHandling}>so so</Button>
          <Button className='bubbles negative wb1' onClick={chooseGIPHYHandling}>discombobulated</Button>
          <Button className='bubbles negative wb1' onClick={chooseGIPHYHandling}>discombobulated</Button>
          </div>
        <br/>
        <div className='col-6 offset-3 d-flex justify-content-center'>
          <Button className='bubbles positive wb2 mx-6' onClick={chooseGIPHYHandling}>excellent</Button>
          <Button className='bubbles negative wb2' onClick={handlingOnClickSkip}>discombobulated</Button>
        </div>
<br/>
        <div><Button className='regular c1 back ' onClick={handlingOnClickSkip}>Back</Button></div>
        <br/>
        <div>
          <Button className='more-shot-outs b3' onClick={handlingOnClickSkip}>Send more Shotouts
          <img className='position-relative ms-1' style={{height:48}} src={ShoutoutIcon} alt='ShoutoutIcon'/></Button>
        </div>
        <br/>
        <div className='col-6 offset-3 d-flex justify-content-center'>
          <Button className='intensity-positive-semicircle b3 n1 active'>1</Button>
          <Button className='intensity-positive-semicircle n2 b3 '>2</Button>
          <Button className='intensity-positive-semicircle n3 b3'>3</Button>
          <Button className='intensity-positive-semicircle n4 b3'>4</Button>
          <Button className='intensity-positive-semicircle n5 b3'>5</Button>
        </div>
        <br/>
        <div className='col-6 offset-3 d-flex justify-content-center '>
          <Button className='intensity-negative-semicircle b3 n1 '>1</Button>
          <Button className='intensity-negative-semicircle n2 b3'>2</Button>
          <Button className='intensity-negative-semicircle n3 b3 active'>3</Button>
          <Button className='intensity-negative-semicircle n4 b3'>4</Button>
          <Button className='intensity-negative-semicircle n5 b3'>5</Button>
        </div>
        <br/>
        <div className='col-6 offset-3 d-flex justify-content-center '>
          <div className='d-flex flex-nowrap position-absolute'>
            <Button className='intensity-negative-quarter-circle b3 n1 '>1</Button>
            <Button className='intensity-negative-quarter-circle n2 b3 '>2</Button>
            <Button className='intensity-negative-quarter-circle n3 b3 '>3</Button>
            <Button className='intensity-negative-quarter-circle n4 b3 '>4</Button>
            <Button className='intensity-negative-quarter-circle n5 b3 active'>5</Button>
          </div>
          <div className='follow-up-field'>
            <textarea className='form-control col-6 offset-3 b3 pt-6 mx-0' placeholder='Placeholder text'/>
          </div>
        </div>
        <br/>
        <div className='col-6 offset-3 d-flex justify-content-center'>
          <input type="text" className='b1' placeholder='Placeholder text b1'/>
          <input type="text" className='b2' placeholder='Placeholder text b2 '/>
          <input type="text" className='b3' placeholder='Placeholder text b3'/>
        </div>
        <br/>
        <div className='col-8 offset-2 d-flex justify-content-center'>
          <textarea type="text" className='b1 w-100' placeholder='Placeholder text b1'/>
        </div>
        <br/>
        <div className='col-10 offset-1 d-flex justify-content-center'>
          <textarea type="text" className='question-field form-control b3'
                    style={{height:340}}
                    placeholder='What would you ask the team? You could be selected!'/>
        </div>
        <div><Button onClick={uploadGIPHYHandling}>Upload</Button></div>
      </div>}
    </Fragment>
  )
}

export default MemeSelection;