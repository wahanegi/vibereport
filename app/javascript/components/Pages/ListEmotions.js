import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {isPresent} from '../helpers/helpers';
import Layout from '../Layout';
import BtnAddYourOwnWord from '../UI/BtnAddYourOwnWord';
import Button from '../UI/Button';
import ButtonEmotion from '../UI/ButtonEmotion';
import NotWorkingModal from './modals/NotWorkingModal';

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
  const {isLoading, error} = service;
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
      .toLocaleString('default', {month: 'long'})
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
        <div className="d-flex flex-column flex-lg-row me-0 me-lg-10 pt-1 pt-md-0">
          <div className="calendar-complete-by mt-lg-8 me-lg-4 mt-0 mx-auto">
            <div className="data">{rangeFormat(timePeriod)}</div>
          </div>
          <div className="mx-auto max-width-emotion-selection">
            <div className="mb-3 fs-8 fs-md-7 text-gray-700">
              Time for your latest check-in!
            </div>
            <h1 className="fs-md-1 lh-1 text-black">
              What word best describes how you feel about work?
            </h1>
            <div className="py-1 mx-auto">
              <div className="row justify-content-center mx-auto">
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
            <div className="w-100 border-bottom border-3 border-light mx-auto"></div>
            <div className="d-flex flex-column">
              <div className="d-flex py-1 gap-2">
                <Button
                  className="btn btn-bubbles neutral wb1 fw-bold not-standart fs-md-8"
                  onClick={() => setIsShuffleEmotions(true)}
                >
                  Show me different words
                </Button>
                <Button
                  className="btn btn-bubbles neutral wb1 fw-bold not-standart fs-md-8"
                  onClick={notSayHandling}
                >
                  I'd rather not say...
                </Button>
              </div>
              <div className="w-75 border-bottom border-3 border-light mx-auto"></div>
            </div>
            <div className="text-center d-flex flex-column justify-content-center">
              <div className="pt-1 fs-md-7 text-gray-700">
                Share it in your own words!
              </div>
              <div className="d-flex">
                <BtnAddYourOwnWord
                  content="Add your own word"
                  onClick={ownWordHandling}
                />
              </div>
              <div className="d-flex mt-2">
                <NavLink
                  className="fs-md-7"
                  onClick={onClickNotWorking}
                  to={''}
                >
                  I was not working recently
                </NavLink>
              </div>
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
