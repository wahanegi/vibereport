import React from 'react';
import {Button} from "react-bootstrap";
import BackButton from "../UI/BackButton";

function NavigationButtons({ data, setData, handlingOnClickNext }) {
  return (
    <div>
      <div>
        <BackButton data={data} setData={setData}>Back</BackButton>
      </div>
      <div>
        |<Button onClick={handlingOnClickNext}>Next</Button>
      </div>
    </div>
  );
}

export default NavigationButtons;