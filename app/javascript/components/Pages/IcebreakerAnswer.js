import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {MAX_CHAR_LIMIT} from '../helpers/consts';
import {isEmptyStr, isNotEmptyStr, isPresent} from '../helpers/helpers';
import Layout from '../Layout';
import {apiRequest} from '../requests/axios_requests';
import BlockLowerBtns from '../UI/BlockLowerBtns';

const FULL_PRIMARY_HEIGHT = 401;
const MARGIN_BOTTOM = 17;
const HEIGHT_ROW_USER = 40;
const SUM_EDGE_DOWN_UP = 41;

const IcebreakerAnswer = ({
                            data,
                            setData,
                            saveDataToDb,
                            steps,
                            service,
                            draft,
                          }) => {
  const {isLoading, error} = service;
  const [loaded, setLoaded] = useState(false);
  const [prevStateAnswer, setPrevStateAnswer] = useState({});
  const [answerFunQuestion, setAnswerFunQuestion] = useState({});
  const [computedHeight, setComputedHeight] = useState(260);
  const prevAnswerBody = prevStateAnswer?.answer_body;
  const answerBody = answerFunQuestion?.answer_body;
  const {user_name, question_body} = data.fun_question;
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

    const dataDraft = {dataRequest, draft: true};
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
    saveDataAnswer(dataFromServer, () => {
    }, true);
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
          () => {
          },
          `${url}${id}`
        ).then();
      } else if (isEmptyStr(answerBody)) {
        apiRequest(
          'DELETE',
          () => {
          },
          () => {
          },
          () => {
          },
          `${url}${id}`
        ).then(goToResultPage);
      } else {
        !isDraft && steps.push('icebreaker-question');
        saveDataToDb(steps, {draft: false});
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
        () => {
        },
        `${url}`
      ).then();
    }
  };

  const onChangAnswer = (e) => {
    setAnswerFunQuestion(
      Object.assign({}, answerFunQuestion, {[e.target.name]: e.target.value})
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
      {loaded && !isLoading && !error && (<>
        <div className="container-fluid w-100 pt-1 pt-md-0">
          <div className=" d-flex flex-column mb-1">
            <h1 className="fs-md-1 text-black mb-1 my-sm-0 mb-sm-3">Kick back, relax. <br/>
              Time for a team question!</h1>
            <h2
              className={`${'text-black mb-0'} ${
                !user && 'text-opacity-0 '
              }`}
            >
              Brought to us by <span className="text-primary text-opacity-0">@</span>
              {user}
            </h2>
          </div>
          <div className="mb-5">
            <div
              className="d-flex flex-column align-items-start mx-auto px-2 py-2 border border-3 rounded rounded-4 border-emerald shadow icebreaker-max-width">
              {user && (
                <p className="fs-8 fs-md-7 text-gray-600">
                  <span className="fs-8 fs-md-7 text-primary">@</span>
                  {user} asks:
                </p>
              )}
              <div id="question" className='text-start fs-7 fs-md-6'>{question_body}</div>
              <div className="w-100">
                <div className="icebreaker border border-3 rounded rounded-4 border-emerald">
                    <textarea
                      className="w-100 fs-8 fs-md-7 p-2 border-0 shadow-none outline-focus-none resize-none"
                      name="answer_body"
                      style={{height: computedHeight - SUM_EDGE_DOWN_UP}}
                      placeholder="Tell us what you think!"
                      value={answerFunQuestion?.answer_body || ''}
                      onChange={onChangAnswer}
                      maxLength={MAX_CHAR_LIMIT}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 mt-4 mx-1 align-self-end">
            <BlockLowerBtns
              isSubmit={true}
              handlingOnClickNext={handlingOnClickNext}
              stringBody={answerBody}
            />
        </div>
      </>)}
    </Layout>
  );
};

export default IcebreakerAnswer;