import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MAX_CHAR_LIMIT } from '../helpers/consts';
import { isBlank, isEmptyStr, isNotEmptyStr, isPresent } from '../helpers/helpers';
import Layout from '../Layout';
import { apiRequest } from '../requests/axios_requests';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import Swal from "sweetalert2";

const InnovationTopic = ({
  data,
  setData,
  saveDataToDb,
  steps,
  service,
  draft,
}) => {
  const [topic, setTopic] = useState({});
  const [prevStateTopic, setPrevStateTopic] = useState({});
  const [isDraft, setIsDraft] = useState(draft);
  const [loaded, setLoaded] = useState(false);

  const { isLoading, error } = service;

  const prevTopicBody = prevStateTopic?.innovation_body;
  const topicBody = topic?.innovation_body;
  const isTopicBody = Boolean(topicBody)
  const current_user_id = data.current_user.id;

  const dataRequest = {
    innovation_topic: {
      innovation_body: topicBody || '',
      user_id: current_user_id,
    },
  };

  useEffect(() => {
    if (topicBody !== prevTopicBody && isDraft) {
      setIsDraft(false);
    }
  }, [topicBody]);

  const handleSaveDraft = () => {
    const dataFromServer = (innovation_topic) => {
      const id = innovation_topic.data?.id;
      saveDataToDb(steps, {
        innovation_topic_id: id,
      });
    };

    const dataDraft = { dataRequest, draft: true };
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
    saveDataTopic(
      dataFromServer,
      () => { },
      true);
  };

  const handlingOnClickNext = () => {
    const dataFromServer = (innovation_topic) => {
      steps.push('icebreaker-answer');
      saveDataToDb(steps, {
        innovation_topic_id: innovation_topic.data.id,
        user_id: current_user_id,
        draft: false,
      });
    };

    const goToResultPage = () => {
      steps.push('icebreaker-answer');
      saveDataToDb(steps);
    };
    saveDataTopic(dataFromServer, goToResultPage);
  };

  const skipHandling = () => {
    handlingOnClickNext()
  }
  const saveDataTopic = (dataFromServer, goToResultPage, isDraft = false) => {
    const url = '/api/v1/innovation_topics/';
    const id = prevStateTopic?.id;

    const handleApiError = (error) => {
      if (error.response && error.response.status === 422) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'This topic already exists. Please enter a different topic.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: 'An error occurred while submitting the topic. Please try again.',
        });
        console.error('Error submitting topic:', error);
      }
    };

    if (isPresent(prevTopicBody)) {
      if (prevTopicBody !== topicBody && isNotEmptyStr(topicBody)) {
        apiRequest(
          'PATCH',
          dataRequest,
          dataFromServer,
          () => { },
          `${url}${id}`,
          handleApiError).then();
      } else if (isEmptyStr(topicBody)) {
        apiRequest(
          'DELETE',
          () => { },
          () => { },
          () => { },
          `${url}${id}`).then(goToResultPage);
      } else {
        !isDraft && steps.push('icebreaker-answer');
        saveDataToDb(steps, { draft: false });
      }
    } else if (isEmptyStr(topicBody)) {
      if (isDraft) {
        steps.push('innovation-topic');
      } else {
        steps.push('icebreaker-answer');
      }
      saveDataToDb(steps);
    } else {
      apiRequest(
        'POST',
        dataRequest,
        dataFromServer,
        () => { },
        `${url}`, handleApiError).then();
    }
  };

  const onChangTopic = (e) => {
    setTopic(
      Object.assign({}, topic, { [e.target.name]: e.target.value })
    );
  };

  useEffect(() => {
    const innovation_topic_id = data.response.attributes.innovation_topic_id;
    isBlank(innovation_topic_id) && setLoaded(true);

    innovation_topic_id && axios.get(`/api/v1/innovation_topics/${innovation_topic_id}`).then((res) => {
      setPrevStateTopic(res.data.data?.attributes);
      setTopic(res.data.data?.attributes);
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
      {loaded && !isLoading && !error && (<>
        <div className="container-fluid w-100 pt-1 pt-md-0">
          <div className=" d-flex flex-column mb-1">
            <h1 className="fs-md-1 text-black mb-1 my-sm-0 mb-sm-3">Suggest a Future Innovation Topic!</h1>
          </div>
          <div className="mb-4">
            <div
              className="d-flex flex-column align-items-start mx-auto px-2 py-2 border border-3 rounded rounded-4 border-royal-blue shadow innovation-max-width">
              <div className="w-100">
                <div className="innovation border border-3 rounded rounded-4 border-royal-blue">
                    <textarea
                      className="w-100 fs-8 fs-md-7 p-2 border-0 shadow-none outline-focus-none resize-none"
                      name="innovation_body"
                      style={{ height: 260 }}
                      placeholder="Tell us what you think!"
                      value={topic?.innovation_body || ''}
                      onChange={onChangTopic}
                      maxLength={MAX_CHAR_LIMIT}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 mt-4 mx-1 align-self-end">
          <BlockLowerBtns
            isNext={isTopicBody}
            skipHandling={skipHandling}
            nextHandling={handlingOnClickNext}
            stringBody={topicBody}
          />
        </div>
      </>)}
    </Layout>
  );
};

export default InnovationTopic;
