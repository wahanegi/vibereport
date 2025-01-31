import React, {useState, useEffect, useRef} from 'react';
import BlockLowerBtns from "../UI/BlockLowerBtns";
import parse from 'html-react-parser'
import edit_pencil from "../../../assets/images/edit-pencil-shadow.svg";
import ShoutoutModal from "../UI/ShoutoutModal";
import trashRed from "../../../assets/images/sys_svg/frame-440.png"
import trash from "../../../assets/images/sys_svg/frame-439.png"
import ShoutoutDelete from "../UI/ShoutoutDelete";
import Layout from "../Layout";
import ShoutoutButton from "../UI/ShoutoutButton";

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

  return (
    <Layout
      data={data}
      setData={setData}
      numShoutouts = {numShoutOuts}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={isDraft}
      handleSaveDraft={handleSaveDraft}
    >
      <div className='container-fluid mt-6'>
        <h1 className='text-black'>Recognition is important!</h1>

        {!numShoutOuts &&
          <div className='mb-6'>
            <h2 className='text-black'>
            Consider giving members of your team a <br/>
            Shoutout to show your appreciation.
            </h2>
          <div className='pt-2'>
            <ShoutoutButton data={data} setData={setData} isDraft={isDraft} saveDataToDb={saveDataToDb} steps={steps} draft={isDraft} handleSaveDraft={handleSaveDraft}/>
            <div className='gray-600 fs-7 mt-1'>Click to give a Shoutout!</div>
          </div>
        </div>
        }
      </div>
        <BlockLowerBtns skipHandling={ skipHandling } nextHandling={ nextHandling } isNext={ !!numShoutOuts } />

      {!!numShoutOuts &&
        <div>
          <h2 className='text-black mb-1'>
            You've mentioned:
          </h2>
        </div>
      }
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
            <div>
              <p className='b3 mt-4 lh-base'>Any more shoutouts to give?</p>
              <ShoutoutButton data={data} setData={setData} isDraft={isDraft} saveDataToDb={saveDataToDb} steps={steps} draft={isDraft} handleSaveDraft={handleSaveDraft}/>
            </div>
          </div>
        }
      {isModal && <ShoutoutDelete onClose={ onClose } data={ data } setData={ setData } idShoutout={ idShoutout }/>}
    </Layout>
  );
};

export default Recognition;