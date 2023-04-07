import React from 'react';
// import {Button} from "react-bootstrap";
import {backHandling} from "../helpers/helpers";
import {BtnBack, BtnNext} from "./ShareContent";

function NavigationButtons({ data, setData, handlingOnClickNext }) {
  return (
    <div className='mt-5'>
      <BtnBack onClick={backHandling} />
      <BtnNext onClick={handlingOnClickNext} />
    </div>
  );
}

export default NavigationButtons;