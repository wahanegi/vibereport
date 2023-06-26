import React, {Fragment, useEffect, useState} from 'react';
import {rangeFormat} from "../../helpers/helpers";
import {
  BtnBack,
  HelpIcon, Logo,
  Wrapper
} from "../../UI/ShareContent";
import axios from "axios";
import EmotionSection from "./EmotionSection";
import GifSection from "./GifSection";
import QuestionSection from "./QuestionSection";
import ShoutoutSection from "./ShoutoutSection";
import CornerElements from "../../UI/CornerElements";
import {Link, NavLink, useParams} from "react-router-dom";
import Menu from "../../UI/Menu";

const ResultsPreview = () => {
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState( [])
  const {answers, emotions, fun_question, gifs, time_periods, sent_shoutouts, received_shoutouts, current_user_shoutouts} = results
  const [timePeriod, setTimePeriod] = useState({})
  const params = useParams();

  const Footer = () => <Fragment>
    <HelpIcon addClass='hud help' />
    <div className='mt-5'>
      <Link to='/'>
        <BtnBack text ='Back to most recent' addClass='mb-4 mt-5' />
      </Link>
    </div>
  </Fragment>

  useEffect(() => {
    if (time_periods) {
      setTimePeriod(time_periods.find(time_period => String(time_period.slug) === params.slug ))
    }
  }, [time_periods?.length])

  useEffect(() => {
    axios.get(`/api/v1/results/${params.slug}`)
      .then(res => {
        setResults(res.data)
        setLoaded(true)
      })
  }, [])

  return loaded && <Fragment>
    <div className='position-relative'>
      <Wrapper>
        <div className='mb-5'>
          <h1 className='text-header-position'>During {rangeFormat(timePeriod)} <br/> the team was feeling...</h1>
        </div>

        <EmotionSection emotions={emotions} nextTimePeriod={true} />
        <GifSection gifs={gifs} nextTimePeriod={true} />
        <ShoutoutSection nextTimePeriod={true}
                         timePeriod={timePeriod}
                         sentShoutouts={sent_shoutouts}
                         receivedShoutouts={received_shoutouts}
                         currentUserShoutouts={current_user_shoutouts} />
        <QuestionSection fun_question={fun_question} answers={answers} nextTimePeriod={true} />
        <CornerElements prevId={results?.response_id} draft={true} hideBottom={true} />
      </Wrapper>
      <Footer />
    </div>
  </Fragment>
}
export default ResultsPreview;
