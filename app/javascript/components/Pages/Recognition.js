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
            <ul className='d-flex d-sm-flex flex-column gap-2 py-2 list-unstyled'>
                {shoutOuts.map(shoutOut => (
                    <li
                        className='bg-light position-relative align-middle border rounded-4 border-4 border-primary p-1 pe-10 text-break '
                        key={shoutOut.id}>
                        <p className='text-start fs-7 fs-sm-5 fs-md-4 fw-semibold m-0'>{parse(shoutOut.rich_text)}</p>

                        <div className='position-absolute top-50 end-0 translate-middle-y d-flex'>
                            <img id={shoutOut.id} src={edit_pencil} alt="pencil" className='img-fluid pointer'
                                 onClick={editHandling}/>
                            <span className="expand-link"
                                  onMouseEnter={(e) =>
                                      e.currentTarget.querySelector(".trash").classList.add("d-none") || e.currentTarget.querySelector(".trashRed").classList.remove("d-none")}
                                  onMouseLeave={(e) =>
                                      e.currentTarget.querySelector(".trash").classList.remove("d-none") || e.currentTarget.querySelector(".trashRed").classList.add("d-none")}
                            >
                                <img src={trash} alt="trash" className='trash img-fluid pointer'
                                     onClick={trashHandling}/>
                                <img id={'trashRed' + shoutOut.id} src={trashRed} alt="trash"
                                     className='trashRed d-none img-fluid pointer' onClick={trashHandling}/>
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
            <div className='container-fluid pt-1 pt-md-0'>
                <h1 className='mb-5 fs-md-1 text-black'>Recognition is important!</h1>

                {!numShoutOuts &&
                    <div className='mb-6'>
                        <h2 className='fs-md-4 text-black mb-4'>
                            Consider giving members of your team a <br/>
                            Shoutout to show your appreciation.
                        </h2>
                        <div className='shoutout-container position-relative'>
                            <ShoutoutButton data={data} setData={setData} isDraft={isDraft} saveDataToDb={saveDataToDb}
                                            steps={steps}
                                            draft={isDraft} handleSaveDraft={handleSaveDraft} isMove={true}/>
                        </div>
                        <p className='gray-600 mt-1 fw-bold'>Click to give a Shoutout!</p>
                    </div>
                }

                {!!numShoutOuts &&
                    <div>
                        <h2 className='fs-md-4 text-black mb-1'>
                            You've mentioned:
                        </h2>
                    </div>
                }

                {!!numShoutOuts &&
                    <div className='d-flex d-sm-flex flex-column mx-auto' style={{maxWidth: "800px"}}>
                        {shoutOutForm.status &&
                            <ShoutoutModal shoutOutForm={shoutOutForm}
                                           setShoutOutForm={setShoutOutForm}
                                           data={data}
                                           setData={setData}
                                           editObj={shoutOutForm.editObj}/>}
                        <div
                            className='container justify-content-center pe-2 border border-4 rounded-4 border-primary field-shout-outs'>
                            {output(shoutOuts)}
                        </div>
                        <p className='m-0 mt-4 fs-8 fs-md-7'>Any more shoutouts to give?</p>
                        <div className={"shoutout-container-small position-relative"}>
                            <ShoutoutButton data={data} setData={setData} isDraft={isDraft} saveDataToDb={saveDataToDb}
                                            steps={steps}
                                            draft={isDraft} handleSaveDraft={handleSaveDraft} num={numShoutOuts}
                                            isMove={true}/>
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