import axios from 'axios';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
const INITIAL_COMPUTED_HEIGHT = 260;
const BORDER_COMPENSATION_PX = 2;

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
  const [computedHeight, setComputedHeight] = useState(INITIAL_COMPUTED_HEIGHT);
  const [loaded, setLoaded] = useState(false);
  const [isDraft, setIsDraft] = useState(draft);
  const { isLoading, error } = service;

  const textareaRef = useRef(null);
  const innovationRef = useRef(null);
  const hintRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandedRef = useRef(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const didInitialSyncRef = useRef(false);
  const [textareaContentHeight, setTextareaContentHeight] = useState(
    260 - SUM_EDGE_DOWN_UP
  );
  const [stackHeight, setStackHeight] = useState(null);
  const [hintTopCollapsedPx, setHintTopCollapsedPx] = useState(null);
  const [innovationBorderVerticalPx, setInnovationBorderVerticalPx] = useState(0);

  const oneLineContentHeightRef = useRef(null);
  const expandedContentHeightRef = useRef(null);

  const prevBrainstormingBody = prevStateBrainstorming?.brainstorming_body;
  const brainstormingBody = brainstorming?.brainstorming_body;
  const { user_name: userName, innovation_body: topicBody } = data.innovation_topic;
  const isInnovationQuestionSubmissionEnabled = data?.innovation_question_submission_enabled;
  const nextStep = isInnovationQuestionSubmissionEnabled ? 'innovation-topic' : 'icebreaker-answer';

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
      saveDataToDb([...steps, nextStep], {
        innovation_brainstorming_id: id,
        draft: false,
      });
    };

    const goToResultPage = () => {
      saveDataToDb([...steps, nextStep]);
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
        saveDataToDb([...steps, nextStep]);
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
        saveDataToDb(isDraft ? steps : [...steps, nextStep], { draft: false });
      }
    } else if (isEmptyStr(brainstormingBody)) {
      if (isDraft) {
        saveDataToDb(steps);
      } else {
        saveDataToDb([...steps, nextStep]);
      }
    } else {
      apiRequest(
        'POST',
        dataRequest,
        dataFromServer,
        () => { },
        `${url}`,
        (err) => {
          if (err?.response?.data?.error?.user_id) showAlertForSuggestedTopic()
        }
      ).then();
    }
  };

  const onChangBrainstorming = (e) => {
    const { name, value } = e.target;

    setBrainstorming((prev) => Object.assign({}, prev, { [name]: value }));

    const oneLineContentHeight = oneLineContentHeightRef.current;
    const expandedContentHeight = expandedContentHeightRef.current;
    const textareaEl = textareaRef.current;

    if (!textareaEl || !oneLineContentHeight || !expandedContentHeight) return;

    if (value.length === 0) {
      isExpandedRef.current = false;
      setIsExpanded(false);
      setTextareaContentHeight(oneLineContentHeight);
      return;
    }

    window.requestAnimationFrame(() => {
      if (!textareaRef.current) return;

      const scrollHeight = textareaRef.current.scrollHeight;

      const expandDelta = 2;
      const collapseDelta = 1;

      const shouldExpand = scrollHeight > oneLineContentHeight + expandDelta;
      const shouldCollapse = scrollHeight <= oneLineContentHeight + collapseDelta;

      let nextExpanded = isExpandedRef.current;
      if (!isExpandedRef.current && shouldExpand) nextExpanded = true;
      if (isExpandedRef.current && shouldCollapse) nextExpanded = false;

      isExpandedRef.current = nextExpanded;
      setIsExpanded(nextExpanded);
      setIsScrollEnabled(nextExpanded);
      setTextareaContentHeight(nextExpanded ? expandedContentHeight : oneLineContentHeight);
    });
  };

  useEffect(() => {
    if (brainstormingBody !== prevBrainstormingBody && isDraft) {
      setIsDraft(false);
    }
  }, [brainstormingBody]);

  useEffect(() => {
    if (!isExpanded) setIsScrollEnabled(false);
  }, [isExpanded]);

  useEffect(() => {
    const innovation_brainstorming_id = data?.response?.attributes?.innovation_brainstorming_id;
    isBlank(innovation_brainstorming_id) && setLoaded(true);

    innovation_brainstorming_id && axios.get(`/api/v1/innovation_brainstormings/${innovation_brainstorming_id}`).then((res) => {
      setPrevStateBrainstorming(res.data.data?.attributes);
      setBrainstorming(res.data.data?.attributes);
      setLoaded(true);
    });
  }, []);

  useLayoutEffect(() => {
    if (!loaded) return;

    const textareaEl = textareaRef.current;
    const innovationEl = innovationRef.current;
    const hintEl = hintRef.current;

    if (!textareaEl || !innovationEl || !hintEl) return;

    const textareaCs = getComputedStyle(textareaEl);
    const lineHeight = parseFloat(textareaCs.lineHeight) || 0;
    const paddingTop = parseFloat(textareaCs.paddingTop) || 0;
    const paddingBottom = parseFloat(textareaCs.paddingBottom) || 0;
    const oneLineContentHeight = lineHeight + paddingTop + paddingBottom;

    const innovationCs = getComputedStyle(innovationEl);
    const borderTop = parseFloat(innovationCs.borderTopWidth) || 0;
    const borderBottom = parseFloat(innovationCs.borderBottomWidth) || 0;
    const innovationBorderVertical = borderTop + borderBottom;

    const expandedContentHeight = computedHeight - SUM_EDGE_DOWN_UP;
    oneLineContentHeightRef.current = oneLineContentHeight;
    setInnovationBorderVerticalPx(innovationBorderVertical);

    const hintCs = getComputedStyle(hintEl);
    const hintMarginTop = parseFloat(hintCs.marginTop) || 0;
    const hintHeight = hintEl.getBoundingClientRect().height;

    const oneLineTotalHeight = oneLineContentHeight + innovationBorderVertical;
    setHintTopCollapsedPx(oneLineTotalHeight);

    const expandedTextareaContentHeight = expandedContentHeight + hintMarginTop;
    expandedContentHeightRef.current = expandedTextareaContentHeight;

    const expandedTotalHeight =
      expandedTextareaContentHeight + innovationBorderVertical;
    const collapsedTotalHeight = oneLineTotalHeight + hintMarginTop + hintHeight;
    setStackHeight(
      Math.max(expandedTotalHeight, collapsedTotalHeight) + BORDER_COMPENSATION_PX
    );

    const currentValue = brainstormingBody || '';

    if (!didInitialSyncRef.current) {
      let shouldExpand = false;
      if (currentValue.length !== 0) {
        textareaEl.style.height = `${oneLineContentHeight}px`;
        shouldExpand = textareaEl.scrollHeight > textareaEl.clientHeight + 1;
      }

      isExpandedRef.current = shouldExpand;
      setIsExpanded(shouldExpand);
      setTextareaContentHeight(
        shouldExpand ? expandedTextareaContentHeight : oneLineContentHeight
      );
      setIsScrollEnabled(shouldExpand);

      didInitialSyncRef.current = true;
      setLayoutReady(true);
    } else {
      setTextareaContentHeight(
        isExpandedRef.current
          ? expandedTextareaContentHeight
          : oneLineContentHeight
      );
    }
  }, [loaded, computedHeight]);

  useEffect(() => {
    if (!layoutReady) return;
    if (computedHeight === INITIAL_COMPUTED_HEIGHT) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionsEnabled(true);
      });
    });
  }, [layoutReady, computedHeight]);

  const handleInnovationTransitionEnd = (e) => {
    const propertyName = e?.propertyName || e?.nativeEvent?.propertyName;
    if (propertyName !== 'height') return;
    if (!isExpandedRef.current) return;
    setIsScrollEnabled(true);
  };

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
                <div
                  className={`innovation-stack ${layoutReady ? '' : 'innovation-stack--loading'} ${transitionsEnabled ? '' : 'innovation-stack--no-transition'}`}
                  style={{ height: stackHeight ?? computedHeight - SUM_EDGE_DOWN_UP }}
                >
                  <div
                    ref={innovationRef}
                    className="innovation border border-3 rounded rounded-4 border-royal-blue"
                    onTransitionEnd={handleInnovationTransitionEnd}
                    style={{
                      height:
                        (textareaContentHeight ?? computedHeight - SUM_EDGE_DOWN_UP) +
                        innovationBorderVerticalPx +
                        BORDER_COMPENSATION_PX,
                    }}
                  >
                    <textarea
                      ref={textareaRef}
                      className={`w-100 fs-8 fs-md-7 px-2 py-1 border-0 shadow-none  outline-focus-none resize-none ${isExpanded && isScrollEnabled ? 'innovation-textarea--expanded' : ''}`}
                      name="brainstorming_body"
                      style={{ height: textareaContentHeight ?? computedHeight - SUM_EDGE_DOWN_UP }}
                      placeholder="Tell us what you think!"
                      value={brainstorming?.brainstorming_body || ''}
                      onChange={onChangBrainstorming}
                      maxLength={MAX_CHAR_LIMIT}
                    />
                  </div>
                  <div
                    ref={hintRef}
                    className={`innovation-hint bg-light text-start px-2 py-1 mt-1 rounded rounded-4 ${isExpanded ? 'innovation-hint--hidden' : ''
                    }`}
                    style={{
                      top: hintTopCollapsedPx ?? 0,
                    }}
                  >
                    <p className="innovation-hint__title  text-gray-700 fs-9 fs-md-8  fw-bold mb-1">
                      Please format your response using the following structure:
                    </p>
                    <ul className="innovation-hint__list mb-1 text-start fs-9 fs-md-8 text-gray-600">
                      <li className="text-start">
                        <span className="fw-bold">Idea:</span> A brief description of the idea.
                      </li>
                      <li className="text-start">
                        <span className="fw-bold">Example:</span> A specific example of how it might work in the
                        product.
                      </li>
                      <li className="text-start">
                        <span className="fw-bold">Benefit:</span> How this change would improve the experience.
                      </li>
                    </ul>
                    <p className="text-gray-600 fs-9 fs-md-8">
                      Ideas can range from small improvements to larger concepts. Both are valuable!
                    </p>
                  </div>
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
