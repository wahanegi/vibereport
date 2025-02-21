import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ButtonEmotion from '../UI/ButtonEmotion';
import BtnAddYourOwnWord from '../UI/BtnAddYourOwnWord';
import Layout from '../Layout';
import Button from '../UI/Button';
import NotWorkingModal from './modals/NotWorkingModal';
import { isPresent } from '../helpers/helpers';

//*** Below what we have in the data. See variable **emotionDataRespUserIdTimePeriod** in the App.js
//***        data: {Emotions:{id:..., type:..., attributes:{ word:..., category:... }},
//***               response:{attributes: {steps: "[\"ListEmotions\"]", word:""}},
//***               current_user_id: ...,
//***               time_period:{...}
function ListEmotions({
  data,
  setData,
  saveDataToDb,
  steps,
  service,
  draft,
  setIsShuffleEmotions,
}) {
  const { isLoading, error } = service;
  const emotions = data.data;
  const timePeriod = data.time_period;
  const [showNotWorkingModal, setShowNotWorkingModal] = useState(false);

  const clickHandling = (emotion_word, emotion_id) => {
    steps.push('emotion-type');
    const dataRequest = {
      emotion_id: emotion_id,
      time_period_id: timePeriod.id,
      user_id: data.current_user.id,
      comment: '',
      rating: '',
      productivity: null,
      draft: false,
      not_working: false,
    };
    saveDataToDb(steps, dataRequest);
  };

  const ownWordHandling = () => {
    steps.push('emotion-entry');
    const dataRequest = {
      time_period_id: data.time_period.id,
      user_id: data.current_user.id,
    };
    saveDataToDb(steps, dataRequest);
  };

  const onClickNotWorking = () => {
    if (
      isPresent(data.response.attributes.id) &&
      !data.response.attributes.not_working
    ) {
      setShowNotWorkingModal(true);
    } else {
      makeNotWorking();
    }
  };

  const makeNotWorking = () => {
    steps.push('results');
    const dataRequest = {
      emotion_id: null,
      not_working: true,
      time_period_id: timePeriod.id,
      user_id: data.current_user.id,
      rating: null,
      comment: null,
      productivity: null,
      gif: {},
      fun_question_id: null,
      completed_at: new Date(),
    };
    saveDataToDb(steps, dataRequest);
  };

  const rangeFormat = (tp) => {
    const dueDate = new Date(tp.due_date);
    const month = dueDate
      .toLocaleString('default', { month: 'long' })
      .slice(0, 3);
    return month + ' ' + `${dueDate.getDate()}`.padStart(2, '0');
  };

  const notSayHandling = () => {
    steps.push('rather-not-say');
    saveDataToDb(steps, {
      emotion_id: '',
      completed_at: null,
      time_period_id: timePeriod.id,
      user_id: data.current_user.id,
    });
  };

  return (
    <Layout
      data={data}
      setData={setData}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={draft}
    >
      {!!error && <p>{error.message}</p>}
      {!isLoading && !error && (
        <div className="col-12 col-md-10 col-lg-8 mx-auto">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12 col-md-auto mb-3 d-flex">
                <div className="calendar-complete-by">
                  <div className="data">{rangeFormat(timePeriod)}</div>
                </div>
              </div>
              <div className="col-12 col-sm w-75">
                <div className="pb-3 fs-5 text-gray-700">
                  Time for your latest check-in!
                </div>
                <div className="lh-1 text-black fs-3 fs-md-1">
                  What word best describes how you feel about work?
                </div>
              </div>
            </div>
          </div>
          <div className="py-1 col-8 col-md-9 col-lg-10 col-xl-8 mx-auto">
            <div className="row justify-content-center">
              {emotions.map((emotion, index) => (
                <div
                  key={emotion.id}
                  className="col-6 col-md-3 d-flex justify-content-center"
                >
                  <ButtonEmotion
                    key={emotion.id}
                    category={emotions[index].attributes.category}
                    onClick={() =>
                      clickHandling(
                        emotions[index].attributes.word,
                        emotions[index].id
                      )
                    }
                  >
                    {emotions[index].attributes.word}
                  </ButtonEmotion>
                </div>
              ))}
            </div>
          </div>
          <div className="w-75 border-bottom border-3 border-light mx-auto"></div>
          <div className="d-flex flex-column">
            <div className="d-flex py-1 gap-2">
              <Button
                className="btn btn-bubbles neutral wb1 not-standart"
                onClick={() => setIsShuffleEmotions(true)}
              >
                Show me different words
              </Button>
              <Button
                className="btn btn-bubbles neutral wb1 not-standart"
                onClick={notSayHandling}
              >
                I'd rather not say...
              </Button>
            </div>
            <div className="w-50 border-bottom border-3 border-light mx-auto"></div>
          </div>
          <div className="text-center d-flex flex-column justify-content-center">
            <div className="py-1 fs-5 text-gray-700 mx-auto">
              Share it in your own words!
            </div>
            <div className="d-flex mx-auto">
              <BtnAddYourOwnWord
                content="Add your own word"
                onClick={ownWordHandling}
              />
            </div>
            <div className="d-flex mx-auto py-2">
              <NavLink
                className="mx-auto my-1"
                onClick={onClickNotWorking}
                to={''}
              >
                I was not working recently
              </NavLink>
            </div>
          </div>
        </div>
      )}
      <NotWorkingModal
        data={data}
        makeNotWorking={makeNotWorking}
        show={showNotWorkingModal}
        setShow={setShowNotWorkingModal}
      />
    </Layout>
  );
}

export default ListEmotions;
