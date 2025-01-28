import React, { Fragment, useState, useEffect } from 'react';
import { isEmptyStr, isNotEmptyStr, isPresent } from '../helpers/helpers';
import { apiRequest } from '../requests/axios_requests';
import axios from 'axios';
import Layout from '../Layout';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import { MAX_CHAR_LIMIT } from '../helpers/consts';

const FULL_PRIMARY_HEIGHT = 401;
const MARGIN_BOTTOM = 17;
const HEIGHT_ROW_USER = 40;
const SUM_EDGE_DOWN_UP = 26;

const IcebreakerAnswer = ({
  data,
  setData,
  saveDataToDb,
  steps,
  service,
  draft,
}) => {
  const { isLoading, error } = service;
  const [loaded, setLoaded] = useState(false);
  const [prevStateAnswer, setPrevStateAnswer] = useState({});
  const [answerFunQuestion, setAnswerFunQuestion] = useState({});
  const [computedHeight, setComputedHeight] = useState(260);
  const prevAnswerBody = prevStateAnswer?.answer_body;
  const answerBody = answerFunQuestion?.answer_body;
  const { user_name, question_body } = data.fun_question;
  const user = user_name;
  const current_user_id = data.current_user.id;
  const [isDraft, setIsDraft] = useState(draft);
  const dataRequest = {
    fun_question_answer: {
      answer_body: answerBody || '',
      user_id: current_user_id,
      fun_question_id: data.fun_question.id,
    },
  };

  useEffect(() => {
    if (answerBody !== prevAnswerBody && isDraft) {
      setIsDraft(false);
    }
  }, [answerBody]);

  const handleSaveDraft = () => {
    const dataFromServer = (fun_question_answer) => {
      saveDataToDb(steps, {
        fun_question_answer_id: fun_question_answer.data.id,
      });
    };

    const dataDraft = { dataRequest, draft: true };
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
    saveDataAnswer(dataFromServer, () => {}, true);
  };

  const handlingOnClickNext = () => {
    const dataFromServer = (fun_question_answer) => {
      steps.push('icebreaker-question');
      saveDataToDb(steps, {
        fun_question_answer_id: fun_question_answer.data.id,
        draft: false,
      });
    };

    const goToResultPage = () => {
      steps.push('results');
      saveDataToDb(steps);
    };
    saveDataAnswer(dataFromServer, goToResultPage);
  };

  const saveDataAnswer = (dataFromServer, goToResultPage, isDraft = false) => {
    const url = '/api/v1/fun_question_answers/';
    const id = prevStateAnswer?.id;

    if (isPresent(prevAnswerBody)) {
      if (prevAnswerBody !== answerBody && isNotEmptyStr(answerBody)) {
        apiRequest(
          'PATCH',
          dataRequest,
          dataFromServer,
          () => {},
          `${url}${id}`
        ).then();
      } else if (isEmptyStr(answerBody)) {
        apiRequest(
          'DELETE',
          () => {},
          () => {},
          () => {},
          `${url}${id}`
        ).then(goToResultPage);
      } else {
        !isDraft && steps.push('icebreaker-question');
        saveDataToDb(steps, { draft: false });
      }
    } else if (isEmptyStr(answerBody)) {
      if (isDraft) {
        steps.push('icebreaker-answer');
      } else {
        steps.push('results');
      }
      saveDataToDb(steps);
    } else {
      apiRequest(
        'POST',
        dataRequest,
        dataFromServer,
        () => {},
        `${url}`
      ).then();
    }
  };

  const onChangAnswer = (e) => {
    setAnswerFunQuestion(
      Object.assign({}, answerFunQuestion, { [e.target.name]: e.target.value })
    );
  };

  useEffect(() => {
    const id = data.response.attributes.fun_question_answer_id;
    axios.get(`/api/v1/fun_question_answers/${id}`).then((res) => {
      setPrevStateAnswer(res.data.data?.attributes);
      setAnswerFunQuestion(res.data.data?.attributes);
      setLoaded(true);
    });
  }, []);

  if (!!error) return <p>{error.message}</p>;

  useEffect(() => {
    setTimeout(function () {
      const el = document.getElementById('question');
      if (el === null) return;
      const style = el.getBoundingClientRect();
      setComputedHeight(
        FULL_PRIMARY_HEIGHT -
          (style.height + MARGIN_BOTTOM) -
          (user ? HEIGHT_ROW_USER : 0)
      );
    }, 1);
  });

  return (
    <Layout
      data={data}
      setData={setData}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={isDraft}
      handleSaveDraft={handleSaveDraft}
    >
      {loaded && !isLoading && !error && (
        <div className="w-100 m-2">
          <div className="mb-3 d-flex flex-column">
            <h1 className="mb-0 lh-1">Kick back, relax.</h1>
            <h1 className="mb-3">Time for a team question!</h1>
            <h2 className={`${'text-black mb-0'} ${!user && 'd-none'}`}>
              Brought to us by <span className="text-primary">@</span>
              {user}
            </h2>
          </div>
          <div className="mb-2">
            <div className="d-flex flex-column align-items-start mx-auto px-2 py-1 border border-3 rounded rounded-4 border-emerald shadow col-12 col-md-8">
              {user && (
                <p className="fs-5 text-gray-600">
                  <span className="text-primary">@</span>
                  {user} asks:
                </p>
              )}
              <h5 id="question">{question_body}</h5>
              <div className="w-100" style={{ height: computedHeight }}>
                <form>
                  <textarea
                    className="w-100 border border-3 rounded rounded-4 border-emerald p-2 wrap-textarea"
                    name="answer_body"
                    style={{ height: computedHeight - SUM_EDGE_DOWN_UP }}
                    placeholder="Tell us what you think!"
                    value={answerFunQuestion?.answer_body || ''}
                    onChange={onChangAnswer}
                    maxLength={MAX_CHAR_LIMIT}
                  />
                </form>
              </div>
            </div>
          </div>
          <BlockLowerBtns
            isSubmit={true}
            handlingOnClickNext={handlingOnClickNext}
            stringBody={answerBody}
          />
        </div>
      )}
    </Layout>
  );
};

export default IcebreakerAnswer;
