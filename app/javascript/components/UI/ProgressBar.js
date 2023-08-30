import React from "react";
import {ProgressBar} from "react-loader-spinner";

export default ({text = ''}) =>
  <div className=''>
    <div className='text-white fs-3'>{text}</div>
    <ProgressBar
      ariaLabel="three-dots-loading"
      visible={true}
    />
  </div>