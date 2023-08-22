import React, {useState, useEffect, useRef} from 'react';
import {Wrapper} from "../UI/ShareContent";
import CornerElements from "../UI/CornerElements";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import parse from 'html-react-parser'
import edit_pencil from "../../../assets/images/edit-pencil-shadow.svg";
import ShoutoutModal from "../UI/ShoutoutModal";
import trashRed from "../../../assets/images/sys_svg/frame-440.png"
import trash from "../../../assets/images/sys_svg/frame-439.png"
import ShoutoutDelete from "../UI/ShoutoutDelete";

const Recognition = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const [ shoutOutForm, setShoutOutForm ] = useState( { status: false, editObj: {}} )
  const [ isModal, setIsModal ] = useState(false)
  const [idShoutout, setIdShoutout] = useState()
  const [isDraft, setIsDraft] = useState(draft)
  const sumShoutOuts = data.user_shoutouts.filter( item => item.time_period_id === data.time_period.id)
  const [previousNumShoutOuts, setPreviousNumShoutOuts] = useState(sumShoutOuts)

  const shoutOuts = sumShoutOuts
      .sort( (a,b) =>  a.updated_at < b.updated_at ? 1 : -1 )

  const numShoutOuts = shoutOuts.length

  const handleSaveDraft = () => {
    saveDataToDb(steps, {draft: true});
    setIsDraft(true);
  }

  useEffect(() => {
    if (previousNumShoutOuts.length !== numShoutOuts) {
      saveDataToDb(steps, {draft: false});
      setIsDraft(false);
    }
  }, [numShoutOuts]);

  const handlingOnClickNext = () => {
    if (!data.fun_question){
      steps.push('causes-to-celebrate')
      saveDataToDb( steps, {draft: false} )
    }else
      steps.push('icebreaker-answer')
    saveDataToDb( steps, {draft: false} )
  }
  const skipHandling = () =>{
    handlingOnClickNext()
  }

  const nextHandling = () =>{
    handlingOnClickNext()
  }
  const editHandling = (e) =>{
    e.preventDefault()
    setIsDraft(false)
    const editObj = data.user_shoutouts.find(item => item.id === Number(e.target.attributes.id.value))

    setShoutOutForm( { status: true, editObj: editObj} )
  }

  const closeHandling = (draft) => {
    setShoutOutForm( { status: false, editObj: {} } )
    setIsDraft(draft)
  }
  const trashHandling = (e) => {
    setIsModal(true)
    setIdShoutout( e.target.attributes.id.value.slice("trashRed".length) )
  }

  const onClose = () => setIsModal(false)

  const output = (shoutOuts) =>{
    return (
      <ul>
      {shoutOuts.map( shoutOut => (
      <li className='c3' key={ shoutOut.id }>
        <span>
          <p className='fw-semibold mb-0  pt-1 pb-1 cut-text'>{parse(shoutOut.rich_text)}</p>
        </span>
        <img  id={ shoutOut.id } src={edit_pencil} alt="pencil" className='pencil' onClick={editHandling}/>
        <span className="expand-link" >
          <img  src={ trash } alt="trash" className='trash' onClick={trashHandling}/>
          <img  id={ 'trashRed'+shoutOut.id } src={trashRed} alt="trash" className='trashRed' onClick={trashHandling}/>
        </span>
      </li>
      ))}
      </ul>
    )
  }

  const cornerElements = (num) => {
    return <CornerElements data = { data }
                           setData = { setData }
                           numShoutouts = { num }
                           isMoveShoutout = { true }
                           saveDataToDb = {saveDataToDb}
                           steps = {steps}
                           draft = {isDraft}
                           handleSaveDraft={handleSaveDraft}/>
  }

  return (
    <Wrapper>
      <div className='mx-auto w-746 h-59 mt-151 mb-4'>
        <h1 className='color-black'>Recognition is important!</h1>
      </div>
        {!numShoutOuts && <div><h2 className='color-black'>
          Consider giving members of your team a <br/>
          Shoutout to show your appreciation.</h2>
          <div className='click-annotation b4'>Click to give a Shoutout!</div>
        </div>
        }

      {!!numShoutOuts && <div><h2 className='color-black mb-1'>You've mentioned:</h2></div>}
        {
          !!numShoutOuts && <div>
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
      {isModal && <ShoutoutDelete onClose={ onClose } data={ data } setData={ setData } idShoutout={ idShoutout }/>}
      <BlockLowerBtns skipHandling={ skipHandling } nextHandling={ nextHandling } isNext = { !!numShoutOuts } />
      {!numShoutOuts && cornerElements( numShoutOuts )}
    </Wrapper>
  );
};

export default Recognition;