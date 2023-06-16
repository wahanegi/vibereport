import React, {Fragment, useEffect, useState} from "react"
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

const CausesToCelebrate = ({data, setData, saveDataToDb, steps, service}) => {
  const {users, response} = data
  const {isLoading, error} = service
  const [loaded, setLoaded] = useState(false)
  const [celebrateShoutout, setCelebrateShoutout] = useState({})
  const [prevCelebrateComment, setPrevCelebrateComment] = useState('')
  const [celebrateComment, setCelebrateComment] = useState('')
  const isEdited = prevCelebrateComment?.trim() !== celebrateComment?.trim()
  const placeholder ='Are you grateful for anything that happened at work recently? \n \n' +
  'Use "@" to include Shoutouts to members of the team!'
  const [show, setShow] = useState(false);

  const goToRecognitionPage = () => {
    steps.push('recognition')
    saveDataToDb(steps)
  }

  const showModal = () => {
    if (!celebrateShoutout?.not_ask) {
      setShow(true)
    } else {
      goToRecognitionPage()
    }
  }

  const onClickNext = () => {
    const dataSend = {
      shoutout: {
        user_id: data.current_user.id,
        time_period_id: data.time_period.id,
        rich_text: mentionToRichText(celebrateComment) || [],
      },
      is_celebrate: true,
      recipients: celebrateComment.match(/[^(]+(?=\))/g) || []
    }
    const dataFromServer = (shoutout) => {
      saveDataToDb(steps, {shoutout_id: shoutout.id})
    }

    const url = '/api/v1/shoutouts/'
    const id = celebrateShoutout?.id
    if(isNotEmptyStr(prevCelebrateComment)) {
      if(isEdited && isNotEmptyStr(celebrateComment)) {
        apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, `${url}${id}`).then(showModal);
      } else if(isEmptyStr(celebrateComment)) {
        apiRequest("DESTROY", dataSend, dataFromServer, () => {}, `${url}${id}`).then(goToRecognitionPage);
      } else {
        goToRecognitionPage()
      }
    } else if (isEmptyStr(celebrateComment)) {
      goToRecognitionPage()
    } else {
      apiRequest("POST", dataSend, dataFromServer, ()=>{}, `${url}`).then(showModal);
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

  const onCommentChange = (e) => {
    setCelebrateComment(e.target.value)
  }

  if (!!error) return <p>{error.message}</p>

  return loaded && !isLoading && <Fragment>
    <Wrapper>
      <h1 className='mt-151'>Are there any recent <br/> causes to celebrate?</h1>
      <div className='d-flex justify-content-center'>
        <MentionsInput value={celebrateComment}
                       onChange={onCommentChange}
                       placeholder={placeholder}
                       style={mentionsInputStyles}
        >
          <Mention
            className={'mentions-mention'}
            trigger="@"
            displayTransform={(id, display) => `@${display}`}
            data={users}
          />
        </MentionsInput>
      </div>

      <BlockLowerBtns nextHandling={onClickNext} skipHandling={onClickNext} isNext={ celebrateComment !== '' } />
      <CornerElements data = { data }
                      setData = { setData }
                      percentCompletion = { 40 } />
      <CelebrateModal show={show}
                      steps={steps}
                      setShow={setShow}
                      saveDataToDb={saveDataToDb}
                      celebrateShoutout={celebrateShoutout}
                      setCelebrateShoutout={setCelebrateShoutout}
                      goToRecognitionPage={goToRecognitionPage}/>
    </Wrapper>
  </Fragment>
}

export default CausesToCelebrate;