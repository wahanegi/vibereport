import axios from 'axios';
import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {MAX_CHAR_LIMIT} from '../helpers/consts';
import {isBlank, isEmptyStr, isNotEmptyStr, isPresent,} from '../helpers/helpers';
import Layout from '../Layout';
import {apiRequest} from '../requests/axios_requests';
import BlockLowerBtns from '../UI/BlockLowerBtns';

const IcebreakerQuestion = ({
                              data,
                              setData,
                              saveDataToDb,
                              steps,
                              service,
                              draft,
                            }) => {
  const {isLoading, error} = service;
  const [loaded, setLoaded] = useState(false);
  const [prevStateQuestion, setPrevStateQuestion] = useState({});
  const [funQuestion, setFunQuestion] = useState({});
  const prevQuestionBody = prevStateQuestion?.question_body;
  const funQuestionBody = funQuestion?.question_body;
  const userName = data.current_user.first_name;
  const [isDraft, setIsDraft] = useState(draft);

  const dataRequest = {
    fun_question: {
      question_body: funQuestionBody,
      user_id: data.current_user.id,
    },
  };

  useEffect(() => {
    if (funQuestionBody !== prevQuestionBody && isDraft) {
      setIsDraft(false);
    }
  }, [funQuestionBody]);

  const handleSaveDraft = () => {
    const dataFromServer = (fun_question) => {
      saveDataToDb(steps, {fun_question_id: fun_question.data.id});
    };
    const dataDraft = {dataRequest, draft: true};
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
    saveDataQuestion(() => {
    }, dataFromServer);
  };

  const handlingOnClickNext = () => {
    const dataFromServer = (fun_question) => {
      steps.push('results');
      saveDataToDb(steps, {
        fun_question_id: fun_question.data.id,
        draft: true,
      });
    };
    const goToResultPage = () => {
      steps.push('results');
      saveDataToDb(steps);
    };
    saveDataQuestion(goToResultPage, dataFromServer);
  };

  const saveDataQuestion = (goToResultPage, dataFromServer) => {
    const url = '/api/v1/fun_questions/'
    const id = prevStateQuestion?.id

    const handleApiError = (error) => {
      if (error.response && error.response.status === 422) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'This question already exists. Please enter a different question.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: 'An error occurred while submitting the question. Please try again.',
        });
        console.error('Error submitting question:', error);
      }
    };

    if (isPresent(prevQuestionBody)) {
      if (prevQuestionBody !== funQuestionBody && isNotEmptyStr(funQuestionBody)) {
        apiRequest("PATCH", dataRequest, dataFromServer, () => {
        }, `${url}${id}`, handleApiError).then();
      } else if (isEmptyStr(funQuestionBody)) {
        apiRequest("DELETE", () => {
        }, () => {
        }, () => {
        }, `${url}${id}`).then(goToResultPage);
      } else {
        goToResultPage();
      }
    } else if (isEmptyStr(funQuestionBody)) {
      goToResultPage();
    } else {
      apiRequest("POST", dataRequest, dataFromServer, () => {
      }, `${url}`, handleApiError).then();
    }
  };

  const onChangQuestion = (e) => {
    setFunQuestion(
      Object.assign({}, funQuestion, {[e.target.name]: e.target.value})
    );
  };

  useEffect(() => {
    const fun_question_id = data.response.attributes.fun_question_id;
    isBlank(fun_question_id) && setLoaded(true);
    fun_question_id &&
    axios.get(`/api/v1/fun_questions/${fun_question_id}`).then((res) => {
      setPrevStateQuestion(res.data.data?.attributes);
      setFunQuestion(res.data.data?.attributes);
      setLoaded(true);
    });
  }, []);

  if (!!error) return <p>{error.message}</p>;

  return (
    <Layout
      data={data}
      setData={setData}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={isDraft}
      handleSaveDraft={handleSaveDraft}
    >
      {!isLoading && !error && (
        <div className="w-100 mx-1 pt-1 pt-md-0">
          <div className="mb-3 d-flex flex-column">
            <h2 className="fs-md-4 m-0 text-black mb-1">Thanks for answering!</h2>
            <h1 className="fs-md-1 m-0 lh-1 col-12 col-lg-6 mx-auto text-black">
              Interested in submitting your own question to the team?
            </h1>
          </div>
          <div className="mb-5">
            <div
              className="d-flex flex-column align-items-start mx-auto px-2 py-2 border border-3 rounded rounded-4 border-emerald shadow icebreaker-max-width">
              <p className="fs-8 fs-md-7 text-gray-600">
                <span className="fs-8 fs-md-7 text-primary">@</span>
                {userName} asks:
              </p>
              {loaded && (
                <div className="w-100">
                  <div className="icebreaker border border-3 rounded rounded-4 border-emerald">
                      <textarea
                        className="w-100 fs-8 fs-md-7 p-2 border-0 shadow-none outline-focus-none resize-none"
                        name="question_body"
                        placeholder="What would you ask the team? You could be selected!"
                        value={funQuestion?.question_body || ''}
                        onChange={onChangQuestion}
                        maxLength={MAX_CHAR_LIMIT}
                        style={{height: '275px'}}
                      />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-100 mt-xxl-10 mt-md-6 mt-4 mx-1 align-self-end">
            <BlockLowerBtns
              isSubmit={true}
              handlingOnClickNext={handlingOnClickNext}
              stringBody={funQuestionBody}
            />
        </div>
      </>)}
    </Layout>
  );
};

export default IcebreakerQuestion;
