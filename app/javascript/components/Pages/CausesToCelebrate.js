import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {
  Footer, Header, Logo, Wrapper
} from "../UI/ShareContent";
import Menu from "../UI/Menu";
import { MentionsInput, Mention } from 'react-mentions'
import mentionStyles from "../UI/mention/mentionStyles";
import mentionsInputStyles from "../UI/mention/mentionsInputStyles";

const CausesToCelebrate = ({data, setData, saveDataToDb, steps, service}) => {
  const {response, users} = data
  const navigate = useNavigate()
  const {isLoading, error} = service
  const [celebrateComment, setCelebrateComment] = useState(response.attributes.celebrate_comment || '')

  const handlingOnClickSkip = () =>{
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps , { })
  }

  const handlingOnClickNext = () => {
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps, {celebrate_comment: celebrateComment})
  }


  useEffect(()=> {
    navigate(`/${data.response.attributes.steps.slice(-1).toString()}`);
  },[])

  const Header = () => <div className='d-flex justify-content-between mx-3 mt-3'>
    <Logo />
    <Menu>X% complete</Menu>
  </div>

  const handleCommentClick = (e) => {
    setCelebrateComment(e.target.value)
  }

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <h1>Are any causes to celebrate this week?</h1>
    <div className='d-flex justify-content-center'>
      <MentionsInput value={celebrateComment}
                     onChange={handleCommentClick}
                     placeholder='Are you gratful for anything that happend during the week?'
                     style={mentionsInputStyles}
      >
        <Mention
          trigger="@"
          displayTransform={(id, display) => `@${display}`}
          data={users}
          style={mentionStyles}
        />
      </MentionsInput>
    </div>

    <Footer nextClick={handlingOnClickNext}
            skipClick={handlingOnClickSkip}
            hideNext={celebrateComment.length === 0}
            hideSkip={celebrateComment.length !== 0}/>
  </Wrapper>
}

export default CausesToCelebrate;