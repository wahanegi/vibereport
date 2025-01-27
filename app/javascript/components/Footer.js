import React from 'react';
import ShoutoutButton from './UI/ShoutoutButton';
import QuestionButton from './UI/QuestionButton';

const Footer = ({ data, setData, hideShoutout }) => {
  return <>
      <div className="position-fixed z-1 left-px-10 bottom-px-10">
        <ShoutoutButton data={data} setData={setData} hideShoutout={hideShoutout} />
      </div>
      <div className="position-fixed z-1 right-px-10 bottom-px-10">
        <QuestionButton data={data} />
      </div>
  </>
};

export default Footer;