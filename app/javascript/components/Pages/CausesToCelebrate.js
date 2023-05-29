import React, {useEffect, useState} from "react"
import {
  Footer, Header, Logo, Wrapper
} from "../UI/ShareContent";
import Menu from "../UI/Menu";
import { MentionsInput, Mention } from 'react-mentions'
import mentionsInputStyles from "../UI/mention/mentionsInputStyles";
import {apiRequest} from "../requests/axios_requests";
import {isBlank, isEmptyStr, isNotEmptyStr} from "../helpers/helpers";

const mentionToRichText = (mention) => {
  const regExpStart = /@\[/g
  const regExpEnd = /]\(\d+\)/g
  return mention.replace(regExpStart, '<span class="color-primary">@').replace(regExpEnd, '</span>')
}

const richTextToMention = (celebrate_shoutout) => {
  if (isBlank(celebrate_shoutout)) return null

  const regExpStart = /<span class="color-primary">@/g
  const regExpEnd = /<\/span>/g
  return celebrate_shoutout.rich_text?.replace(regExpStart, '@[').replace(regExpEnd, `](${celebrate_shoutout.id})`)
}

const CausesToCelebrate = ({data, setData, saveDataToDb, steps, service}) => {
  const {celebrate_shoutout, users} = data
  const {isLoading, error} = service
  const prevCelebrateComment = richTextToMention(celebrate_shoutout) || ''
  const [celebrateComment, setCelebrateComment] = useState(prevCelebrateComment)
  const isEdited = prevCelebrateComment.trim() !== celebrateComment.trim()
  console.log('celebrateComment', celebrateComment)
  console.log('celebrate_shoutout', celebrate_shoutout)
  const goToRecognitionPage = () => {
    steps.push('recognition')
    saveDataToDb(steps)
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
    const dataFromServer = ( createdUpdatedShoutOut ) => {
      console.log("createdUpdatedShoutOut", createdUpdatedShoutOut)
      let  currentCelebrateShoutout  = data.celebrate_shoutout
      if (isEdited && isNotEmptyStr(prevCelebrateComment)) {
        // currentCelebrateShoutout = currentShoutOuts.filter( item => item.id !== celebrate_shoutout.id )
      }
      setData({
        ...data,
        // user_shoutouts: [...currentShoutOuts, createdUpdatedShoutOut],
        celebrate_shoutout: {...{ rich_text: mentionToRichText(celebrateComment)}}
      })
    }

    const url = '/api/v1/shoutouts/'
    const id = celebrate_shoutout?.id
    if(isNotEmptyStr(prevCelebrateComment)) {
      if(isEdited && isNotEmptyStr(celebrateComment)) {
        goToRecognitionPage()
        apiRequest("PATCH", dataSend, dataFromServer, ()=>{}, `${url}${id}`).then();
      } else if(isEmptyStr(celebrateComment)) {
        goToRecognitionPage()
        apiRequest("DESTROY", dataSend, dataFromServer, () => {}, `${url}${id}`).then();
      } else {
        goToRecognitionPage()
      }
    } else if (isEmptyStr(celebrateComment)) {
      goToRecognitionPage()
    } else {
      apiRequest("POST", dataSend, dataFromServer, ()=>{}, `${url}`).then();
      goToRecognitionPage()
    }
  }

  const Header = () => <div className='d-flex justify-content-between mx-3 mt-3'>
    <Logo />
    <Menu>X% complete</Menu>
  </div>

  const onCommentChange = (e) => {
    setCelebrateComment(e.target.value)
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <h1>Are there any recent <br/> causes to celebrate?</h1>
    <div className='d-flex justify-content-center'>
      <MentionsInput value={celebrateComment}
                     onChange={onCommentChange}
                     placeholder='Are you grateful for anything that happened at work recently?'
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

    <Footer nextClick={onClickNext}
            skipClick={onClickNext}
            hideNext={isEmptyStr(celebrateComment)}
            hideSkip={isNotEmptyStr(celebrateComment)}/>
  </Wrapper>
}

export default CausesToCelebrate;