import parse from 'html-react-parser'
import React, {useEffect, useState} from 'react';
import edit_pencil from "../../../assets/images/edit-pencil-shadow.svg";
import trash from "../../../assets/images/sys_svg/frame-439.png"
import trashRed from "../../../assets/images/sys_svg/frame-440.png"
import Layout from "../Layout";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import ShoutoutButton from "../UI/ShoutoutButton";
import ShoutoutDelete from "../UI/ShoutoutDelete";
import ShoutoutModal from './modals/ShoutoutModal';

const Recognition = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const [shoutOutForm, setShoutOutForm] = useState({status: false, editObj: {}})
  const [isModal, setIsModal] = useState(false)
  const [idShoutout, setIdShoutout] = useState()
  const [isDraft, setIsDraft] = useState(draft)
  const sumShoutOuts = data.user_shoutouts.filter(item => item.time_period_id === data.time_period.id)
  const [previousNumShoutOuts, setPreviousNumShoutOuts] = useState(sumShoutOuts)

  const shoutOuts = sumShoutOuts
    .sort((a, b) => a.updated_at < b.updated_at ? 1 : -1)

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
    if (!data.fun_question) {
      steps.push('causes-to-celebrate')
      saveDataToDb(steps, {draft: false})
    } else
      steps.push('icebreaker-answer')
    saveDataToDb(steps, {draft: false})
  }
  const skipHandling = () => {
    handlingOnClickNext()
  }

  const nextHandling = () => {
    handlingOnClickNext()
  }
  const editHandling = (e) => {
    e.preventDefault()
    setIsDraft(false)
    const editObj = data.user_shoutouts.find(item => item.id === Number(e.target.attributes.id.value))

    setShoutOutForm({status: true, editObj: editObj})
  }

  const closeHandling = (draft) => {
    setShoutOutForm({status: false, editObj: {}})
    setIsDraft(draft)
  }
  const trashHandling = (e) => {
    setIsModal(true)
    setIdShoutout(e.target.attributes.id.value.slice("trashRed".length))
  }

  const onClose = () => setIsModal(false)

  const output = (shoutOuts) => {
    return (
      <ul className='d-flex d-sm-flex flex-column gap-4 p-3 list-unstyled'>
        {shoutOuts.map(shoutOut => (
          <li
            className='c3 bg-light fs-lg-2 fs-sm-4 position-relative align-middle border rounded-4 border-3 border-primary p-1 text-break'
            key={shoutOut.id}>
        <span>
          <p className='text-black align-middle text-start lh-base'>{parse(shoutOut.rich_text)}</p>
        </span>
            <div className='position-absolute top-50 start-100 translate-middle p-2'>
              <img id={shoutOut.id} src={edit_pencil} alt="pencil" className='pencil' onClick={editHandling}/>
              <span className="expand-link"
                    onMouseEnter={(e) =>
                      e.currentTarget.querySelector(".trash").classList.add("d-none") || e.currentTarget.querySelector(".trashRed").classList.remove("d-none")}
                    onMouseLeave={(e) =>
                      e.currentTarget.querySelector(".trash").classList.remove("d-none") || e.currentTarget.querySelector(".trashRed").classList.add("d-none")}
              >
            <img src={trash} alt="trash" className='trash' onClick={trashHandling}/>
            <img id={'trashRed' + shoutOut.id} src={trashRed} alt="trash" className='trashRed d-none'
                 onClick={trashHandling}/>
          </span>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Layout
      data={data}
      setData={setData}
      numShoutouts={numShoutOuts}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={isDraft}
      handleSaveDraft={handleSaveDraft}
    >
      <div className='container-fluid'>
        <h1 className='text-black'>Recognition is important!</h1>

        {!numShoutOuts &&
          <div className='mb-6'>
            <h2 className='text-black'>
              Consider giving members of your team a <br/>
              Shoutout to show your appreciation.
            </h2>
            <div className='pt-2'>
              <ShoutoutButton data={data} setData={setData} isDraft={isDraft} saveDataToDb={saveDataToDb} steps={steps}
                              draft={isDraft} handleSaveDraft={handleSaveDraft}/>
              <div className='gray-600 fs-7 mt-1'>Click to give a Shoutout!</div>
            </div>
          </div>
        }

        {!!numShoutOuts &&
          <div>
            <h2 className='text-black my-3'>
              You've mentioned:
            </h2>
          </div>
        }
        {!!numShoutOuts &&
          <div className='d-flex d-sm-flex flex-column'>
            {shoutOutForm.status &&
              <ShoutoutModal shoutOutForm={shoutOutForm}
                             setShoutOutForm={setShoutOutForm}
                             data={data}
                             setData={setData}
                             editObj={shoutOutForm.editObj}/>}
            <div
              className='container container-sm container-md justify-content-center border border-4 rounded-4 border-primary field-shout-outs'>
              {output(shoutOuts)}
            </div>
            <div className='mb-6'>
              <p className='fs-5 mt-4 lh-base'>Any more shoutouts to give?</p>
              <ShoutoutButton data={data} setData={setData} isDraft={isDraft} saveDataToDb={saveDataToDb} steps={steps}
                              draft={isDraft} handleSaveDraft={handleSaveDraft}/>
            </div>
          </div>
        }
        {isModal && <ShoutoutDelete onClose={onClose} data={data} setData={setData} idShoutout={idShoutout}/>}
          <BlockLowerBtns skipHandling={skipHandling} nextHandling={nextHandling} isNext={!!numShoutOuts}/>
      </div>
    </Layout>
  );
};

export default Recognition;