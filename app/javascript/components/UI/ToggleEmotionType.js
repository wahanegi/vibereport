import iconNegative from "../../../assets/images/icon_negative.svg";
import iconPositive from "../../../assets/images/icon_positive.svg";
import React from "react";

const ToggleEmotionType = ({selectedType, handleEmotionType}) => {

  return(
    <div>
      <h4>How do you feel about this word?</h4>
      <div className="btn-group wrap-toggle" role="group" aria-label="Basic radio toggle button group">
        <input
          type="radio"
          className={`btn-check toggle-negative-check negative`}
          id="negative"
          autoComplete="off"
          checked={selectedType === 'negative'}
          onChange={() => handleEmotionType('negative')}
        />
        <label className="btn toggle-category toggle-negative" htmlFor="negative">
          <div className="wrap-icon d-flex flex-column align-items-center mt-1">
            <img className="icon-negative" src={iconNegative} alt={"negative"}/>
            <span>Negative</span>
          </div>
        </label>

        <input
          type="radio"
          className={`btn-check toggle-positive-check positive`}
          id="positive"
          autoComplete="off"
          checked={selectedType === 'positive'}
          onChange={() => handleEmotionType('positive')}
        />
        <label className="btn toggle-category toggle-positive" htmlFor="positive">
          <div className="wrap-icon d-flex flex-column align-items-center mt-1">
            <img className="icon-positive" src={iconPositive} alt={"positive"}/>
            <span>Positive</span>
          </div>
        </label>
      </div>
    </div>
  )
}

export default ToggleEmotionType