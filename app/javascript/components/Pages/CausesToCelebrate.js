import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {
  Footer, Header, Logo, Wrapper
} from "../UI/ShareContent";
import Menu from "../UI/Menu";
import { MentionsInput, Mention } from 'react-mentions'
import {isBlank, isPresent} from "../helpers/helpers";

const CausesToCelebrate = ({data, setData, saveDataToDb, steps, service}) => {
  const {response, users} = data
  const navigate = useNavigate()
  const {isLoading, error} = service
  const [celebrateComment, setCelebrateComment] = useState(response.attributes.celebrate_comment || '')

console.log('users', users)
  console.log('celebrateComment', celebrateComment)
  const handlingOnClickSkip = () =>{
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps , { })
  }

  const handlingOnClickNext = () => {
    steps.push('ProductivityCheckLow')
    saveDataToDb( steps, {})
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
    <div className="rating-comment-container">
      <h1>Are any causes to celebrate this week?</h1>
      {/*<form>*/}
      {/*  <div className="form-group">*/}
      {/*    <label className="comment-label">*/}
      {/*      <textarea*/}
      {/*        className="form-control text-left"*/}
      {/*        placeholder="Are you greatefull for anathyng that happend during this week?"*/}
      {/*        defaultValue={celebrateComment}*/}
      {/*        onChange={handleCommentClick}*/}
      {/*        maxLength={700}*/}
      {/*      />*/}
      {/*    </label>*/}
      {/*  </div>*/}
      {/*</form>*/}
      <MentionsInput value={celebrateComment} onChange={handleCommentClick}>
        <Mention
          trigger="@"
          data={users}
          // renderSuggestion={this.renderUserSuggestion}
        />
      </MentionsInput>
    </div>
    <Footer nextClick={handlingOnClickNext} skipClick={handlingOnClickSkip} hideNext={isBlank(celebrateComment)} hideSkip={isPresent(celebrateComment)}/>
  </Wrapper>
}

export default CausesToCelebrate;