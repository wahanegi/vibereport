import React, {Fragment, useEffect, useRef, useState} from "react"
import {
  Wrapper
} from "../UI/ShareContent";
import { MentionsInput, Mention } from 'react-mentions'
import mentionsInputStyles from "../UI/mention/mentionsInputStyles";
import {apiRequest} from "../requests/axios_requests";
import {isBlank, isEmptyStr, isNotEmptyStr} from "../helpers/helpers";
import axios from "axios";
import CelebrateModal from "./modals/CelebrateModal";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import CornerElements from "../UI/CornerElements";
import {MAX_CHAR_LIMIT} from "../helpers/consts";

const mentionToRichText = (mention) => {
  const regExpStart = /@\[/g
  const regExpEnd = /]\(\d+\)/g
  return mention.replace(regExpStart, '<span class="color-primary">@').replace(regExpEnd, '</span>')
}

const richTextToMention = (celebrate_shoutout) => {
  if (isBlank(celebrate_shoutout) || isBlank(celebrate_shoutout.id)) return null

  const regExpStart = /<span class="color-primary">@/g
  const regExpEnd = /<\/span>/g
  return celebrate_shoutout.rich_text?.replace(regExpStart, '@[').replace(regExpEnd, `](${celebrate_shoutout.id})`)
}

const CausesToCelebrate = ({data, setData, saveDataToDb, steps, service, draft}) => {
  const {users, response, current_user} = data
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [celebrateShoutout, setCelebrateShoutout] = useState({})
  const [prevCelebrateComment, setPrevCelebrateComment] = useState('')
  const [celebrateComment, setCelebrateComment] = useState('')
  const isEdited = prevCelebrateComment?.trim() !== celebrateComment?.trim()
  const placeholder = 'Are you grateful for anything that happened at work recently? \n \n' +
  'Use "@" to include Shoutouts to members of the team!'
  const [show, setShow] = useState(false);
  const [isDraft, setIsDraft] = useState(draft);
  const [notAskVisibility, setNotAskVisibility] = useState(current_user.not_ask_visibility);

  const dataSend = {
    shoutout: {
      user_id: data.current_user.id,
      time_period_id: data.time_period.id,
      rich_text: mentionToRichText(celebrateComment) || [],
    },
    is_celebrate: true,
    recipients: celebrateComment.match(/[^(]+(?=\))/g) || []
  }

  const handleSaveDraft = () => {
    const dataFromServer = (shoutout) =>{
      saveDataToDb( steps, {shoutout_id: shoutout.id} )
    }

    const dataDraft = {dataSend, draft: true};
    saveDataToDb(steps, dataDraft)
    setIsDraft(true)
    saveDataCelebrate(dataFromServer, ()=>{}, true);
  }

  useEffect(() => {
    if (isEdited && isDraft) {
      setIsDraft(false);
    }
  }, [celebrateComment]);

  const goToRecognitionPage = () => {
    steps.push('recognition')
    saveDataToDb(steps, {draft: false})
  }

  const showModal = () => {
    if (!current_user.not_ask_visibility && celebrateComment.includes('@[')) {
      setShow(true)
    } else {
      goToRecognitionPage()
    }
  }

  const handlingOnClickNext = () => {
    const dataFromServer = (shoutout) => {
      saveDataToDb(steps, {shoutout_id: shoutout.id, draft: false})
    }
    const goToRecognitionPage = () => {
      steps.push('recognition')
      saveDataToDb(steps, {draft: false} )
    }
    saveDataCelebrate(dataFromServer, goToRecognitionPage)
  };

  const saveDataCelebrate = (dataFromServer, goToRecognitionPage, isDraft= false) => {
    const url = '/api/v1/shoutouts/'
    const id = celebrateShoutout?.id
    if(isNotEmptyStr(prevCelebrateComment)) {
      if(isEdited && isNotEmptyStr(celebrateComment)) {
        apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, `${url}${id}`).then(!isDraft && showModal);
      } else if(isEmptyStr(celebrateComment)) {
        apiRequest("DELETE", dataSend, dataFromServer, () => {}, `${url}${id}`).then(goToRecognitionPage);
      } else {
        !isDraft && showModal()
      }
    } else if (isEmptyStr(celebrateComment)) {
      !isDraft && goToRecognitionPage()
    } else {
      apiRequest("POST", dataSend, dataFromServer, ()=>{}, `${url}`).then(!isDraft && showModal);
    }
  }

  useEffect(() => {
    const shoutout_id = response.attributes.shoutout_id
    isBlank(shoutout_id) && setLoaded(true)
    shoutout_id && axios.get(`/api/v1/shoutouts/${shoutout_id}`)
      .then(res => {
        setCelebrateShoutout(res.data.data?.attributes)
        setPrevCelebrateComment(richTextToMention(res.data.data?.attributes))
        setCelebrateComment(richTextToMention(res.data.data?.attributes))
        setLoaded(true)
      })
  }, [response.attributes.shoutout_id])

  const onCommentChange = (e, newValue) => {
    if (newValue.length <= MAX_CHAR_LIMIT) {
      setCelebrateComment(e.target.value)
    }
  }

  const inputRef = useRef(null);
  const handleFocus = () => {
    inputRef.current.style.border = '6px solid #5689EB';
    inputRef.current.style.outline = 'none';
    inputRef.current.style.padding = '6px';
  };

  const handleBlur = () => {
    inputRef.current.style.border = '3px solid #5689EB';
    inputRef.current.style.padding = '9px';
  };

  if (!!error) return <p>{error.message}</p>

  return loaded && !isLoading && <Fragment>
    <Wrapper>
      <h1 className='mt-151'>Are there any recent <br/> causes to celebrate?</h1>
      <div className='d-flex justify-content-center'>
        <MentionsInput value={celebrateComment}
                       className={`celebrate ${celebrateComment ? '' : 'celebrate-placeholder'}`}
                       onFocus={handleFocus}
                       onBlur={handleBlur}
                       inputRef={inputRef}
                       onChange={onCommentChange}
                       placeholder={placeholder}
                       style={mentionsInputStyles}
        >
          <Mention
            className={'mentions-mention'}
            trigger="@"
            displayTransform={(id, display) => `@${display}`}
            data={users.filter(user => user.id !== data.current_user.id)}
          />
        </MentionsInput>
      </div>

      <BlockLowerBtns nextHandling={handlingOnClickNext} skipHandling={handlingOnClickNext} isNext={ celebrateComment !== '' } />
      <CornerElements data = { data }
                      setData = { setData }
                      saveDataToDb={saveDataToDb}
                      steps={steps}
                      draft={isDraft}
                      handleSaveDraft={handleSaveDraft} />
      <CelebrateModal show={show}
                      steps={steps}
                      setShow={setShow}
                      saveDataToDb={saveDataToDb}
                      current_user={current_user}
                      notAskVisibility={notAskVisibility}
                      setNotAskVisibility={setNotAskVisibility}
                      goToRecognitionPage={goToRecognitionPage}/>
    </Wrapper>
  </Fragment>
}

export default CausesToCelebrate;