import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MAX_CHAR_LIMIT } from '../helpers/consts';
import { isBlank, isEmptyStr, isNotEmptyStr, isPresent } from '../helpers/helpers';
import Layout from '../Layout';
import { apiRequest } from '../requests/axios_requests';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import SweetAlert from "../UI/SweetAlert";

const FULL_PRIMARY_HEIGHT = 401;
const MARGIN_BOTTOM = 17;
const HEIGHT_ROW_USER = 40;
const SUM_EDGE_DOWN_UP = 41;

const InnovationBrainstorming = ({
  data,
  setData,
  saveDataToDb,
  steps,
  service,
  draft,
}) => {
  const [prevStateBrainstorming, setPrevStateBrainstorming] = useState({});
  const [brainstorming, setBrainstorming] = useState({});
  const [computedHeight, setComputedHeight] = useState(260);
  const [loaded, setLoaded] = useState(false);
  const [isDraft, setIsDraft] = useState(draft);
  const { isLoading, error } = service;

  const prevBrainstormingBody = prevStateBrainstorming?.brainstorming_body;
  const brainstormingBody = brainstorming?.brainstorming_body;
  const { user_name: userName, innovation_body: topicBody } = data.innovation_topic;
  const isUserName = Boolean(userName)

  const dataRequest = {
    innovation_brainstorming: {
      brainstorming_body: brainstormingBody || '',
      innovation_topic_id: data.innovation_topic.id,
    },
  };

  const handleSaveDraft = () => {
    const dataFromServer = (innovation_brainstorming) => {
      const id = innovation_brainstorming.data?.id;
      saveDataToDb(steps, {
        innovation_brainstorming_id: id,
      });
    };

    saveDataToDb(steps, { draft: true });
    setIsDraft(true);
    saveDataBrainstorming(dataFromServer, () => {
    }, true);
  };

  const handlingOnClickNext = () => {
    const dataFromServer = (innovation_brainstorming) => {
      const id = innovation_brainstorming.data?.id;
      steps.push('innovation-topic');
      saveDataToDb(steps, {
        innovation_brainstorming_id: id,
        draft: false,
      });
    };

    const goToResultPage = () => {
      steps.push('innovation-topic');
      saveDataToDb(steps);
    };
    saveDataBrainstorming(dataFromServer, goToResultPage);
  };

  const skipHandling = () => {
    handlingOnClickNext()
  }

  const showAlertForSuggestedTopic = () => {
    SweetAlert({
      alertTitle: 'Already suggested',
      alertHtml: 'You can suggest only one brainstorming per topic.',
      confirmButtonText: 'OK',
      showCancelButton: false,
      showCloseButton: false,
      onConfirmAction: () => {
        steps.push('innovation-topic');
        saveDataToDb(steps);
      }
    });
  };

  const saveDataBrainstorming = (dataFromServer, goToResultPage, isDraft = false) => {
    const url = '/api/v1/innovation_brainstormings/';
    const id = prevStateBrainstorming?.id;

    if (isPresent(prevBrainstormingBody)) {
      if (prevBrainstormingBody !== brainstormingBody && isNotEmptyStr(brainstormingBody)) {
        apiRequest(
          'PATCH',
          dataRequest,
          dataFromServer,
          () => {
          },
          `${url}${id}`
        ).then();
      } else if (isEmptyStr(brainstormingBody)) {
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
        !isDraft && steps.push('innovation-topic');
        saveDataToDb(steps, { draft: false });
      }
    } else if (isEmptyStr(brainstormingBody)) {
      if (isDraft) {
        steps.push('innovation-brainstorming');
      } else {
        steps.push('innovation-topic');
      }
      saveDataToDb(steps);
    } else {
      apiRequest(
        'POST',
        dataRequest,
        dataFromServer,
        () => {},
        `${url}`,
        (err) => {
          if (err?.response?.data?.error?.user_id) showAlertForSuggestedTopic()
        }
      ).then();
    }
  };

  const onChangBrainstorming = (e) => {
    setBrainstorming(
      Object.assign({}, brainstorming, { [e.target.name]: e.target.value })
    );
  };

  useEffect(() => {
    if (brainstormingBody !== prevBrainstormingBody && isDraft) {
      setIsDraft(false);
    }
  }, [brainstormingBody]);

  useEffect(() => {
    const innovation_brainstorming_id = data?.response?.attributes?.innovation_brainstorming_id; // CHANGED !!!
    isBlank(innovation_brainstorming_id) && setLoaded(true);

    innovation_brainstorming_id && axios.get(`/api/v1/innovation_brainstormings/${innovation_brainstorming_id}`).then((res) => {
      setPrevStateBrainstorming(res.data.data?.attributes);
      setBrainstorming(res.data.data?.attributes);
      setLoaded(true);
    });
  }, []);

  if (!!error) return <p>{error.message}</p>;

  useEffect(() => {
    setTimeout(function () {
      const el = document.getElementById('topic');
      if (el === null) return;
      const style = el.getBoundingClientRect();
      setComputedHeight(
        FULL_PRIMARY_HEIGHT -
        (style.height + MARGIN_BOTTOM) -
        (isUserName ? HEIGHT_ROW_USER : 0)
      );
    }, 1);
  }, [isUserName]);

  if (!data.innovation_topic) return null;

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
            <h1 className="fs-md-1 text-black mb-1 my-sm-0 mb-sm-3">This Week’s Innovation Topic </h1>
            <h2
              className={`text-black mb-0 ${!isUserName && 'd-none'}`}
            >
              introduced by {userName}
            </h2>
          </div>
          <div className="mb-4">
            <div
              className="d-flex flex-column align-items-start mx-auto px-2 py-2 border border-3 rounded rounded-4 border-royal-blue shadow innovation-max-width">
              {isUserName && (
                <p className="fs-8 fs-md-7 text-gray-600 lh-lg"> {userName} suggests: </p>
              )}
              <div id="topic" className='text-start fs-7 fs-md-6 mb-1'>{topicBody}</div>
              <div className="w-100">
                <div className="innovation border border-3 rounded rounded-4 border-royal-blue">
                    <textarea
                      className="w-100 fs-8 fs-md-7 p-2 border-0 shadow-none outline-focus-none resize-none"
                      name="brainstorming_body"
                      style={{ height: computedHeight - SUM_EDGE_DOWN_UP }}
                      placeholder="Tell us what you think!"
                      value={brainstorming?.brainstorming_body || ''}
                      onChange={onChangBrainstorming}
                      maxLength={MAX_CHAR_LIMIT}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 mt-4 mx-1 align-self-end">
          <BlockLowerBtns
            isNext={!!brainstormingBody}
            skipHandling={skipHandling}
            nextHandling={handlingOnClickNext}
            stringBody={brainstormingBody}
          />
        </div>
      </>)}
    </Layout>
  );
};

export default InnovationBrainstorming;
