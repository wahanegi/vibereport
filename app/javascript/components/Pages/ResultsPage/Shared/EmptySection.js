import React, { Fragment, useEffect, useState } from "react";
import { updateResponse } from "../../../requests/axios_requests";
import { isPresent } from "../../../helpers/helpers";

const EmptySection = ({
  nextTimePeriod,
  hoverText,
  defaultTextCurrent,
  defaultTextNext,
  stepName,
  setShowWorkingModal,
  data,
  setData,
  children,
  hoverEnabled = true,
  topicExists = true,
  emptyClass
}) => {
  const [text, setText] = useState("");
  const [addClass, setAddClass] = useState("");
  const handleMouseEnter = () => {
    if (!hoverEnabled || nextTimePeriod || !topicExists) return;

    setText(hoverText);
    setAddClass("hover-event");
  };

  const handleMouseLeave = () => {
    setText(nextTimePeriod || !topicExists ? defaultTextNext : defaultTextCurrent);
    setAddClass("");
  };

  const handlingBack = () => {
    if (isPresent(data?.prev_results_path) || !topicExists) return;

    const steps = data.response.attributes.steps;
    const index = steps.indexOf(stepName);

    if (index === -1) {
      !nextTimePeriod && setShowWorkingModal(true);
    } else {
      const newSteps = steps.slice(0, index + 1);

      const dataRequest = {
        response: { attributes: { steps: newSteps } }
      };

      !nextTimePeriod && updateResponse(data, setData, dataRequest);
    }
  };

  useEffect(() => {
    setText(nextTimePeriod || !topicExists ? defaultTextNext : defaultTextCurrent);
  }, [nextTimePeriod, topicExists]);

  return (
    <Fragment>
      {children}

      <section
        onClick={handlingBack}
        className={`results col-12 col-xxl-9 col-xl-9 col-lg-9 col-md-10 col-sm-12 ${
          nextTimePeriod || !topicExists ? "" : "pointer"
        }`}
      >
        <div
          className={`${emptyClass} ${addClass} row wrap mb-3 mw-100`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <h5 className="d-flex justify-content-center fw-semibold">{text}</h5>
        </div>
      </section>
    </Fragment>
  );
};

export default EmptySection;
