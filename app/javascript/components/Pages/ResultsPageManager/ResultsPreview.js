import React, {Fragment, useEffect, useState} from 'react';
import {rangeFormat} from "../../helpers/helpers";
import {
  BtnBack,
  HelpIcon,
  Wrapper
} from "../../UI/ShareContent";
import axios from "axios";
import EmotionSection from "./EmotionSection";
import GifSection from "./GifSection";
import CornerElements from "../../UI/CornerElements";
import {Link, useParams} from "react-router-dom";

const ResultsPreview = () => {
  const [loaded, setLoaded] = useState(false)
  const [results, setResults] = useState( [])
  const {emotions, gifs, time_periods} = results
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
  }, [time_periods.length])

  useEffect(() => {
    axios.get(`/api/v1/result_managers/${params.slug}`)
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
        <div className="folder-shape">
          <div className="b3 position">Leader Panel
            <img className="image-container ms-1" src={LeaderVector} />
          </div>
          <EmotionSection emotions={emotions} nextTimePeriod={nextTimePeriod} data={data} isMinUsersResponses={isMinUsersResponses} />
        </div>
        <GifSection gifs={gifs} nextTimePeriod={true} />
        <CornerElements preview={'results'} draft={true} hideBottom={true} />
      </Wrapper>
      <Footer />
    </div>
  </Fragment>
}
export default ResultsPreview;
