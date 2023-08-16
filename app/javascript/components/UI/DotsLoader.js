import React from "react";
import {ThreeDots} from "react-loader-spinner";

export default ({text = ''}) =>
  <div className='d-inline-flex'>
    <div className='text-white h1 me-1'>{text}</div>
    <ThreeDots
      height="30"
      width="30"
      radius="5"
      color="#FFFFFF"
      ariaLabel="three-dots-loading"
      visible={true}
    />
  </div>