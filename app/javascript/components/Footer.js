import React from 'react';
import ShoutoutButton from './UI/ShoutoutButton';
import QuestionButton from './UI/QuestionButton';

const Footer = ({ data, setData, hideShoutout }) => {
  return (
    <footer className="d-flex w-100 px-3 pb-1 position-fixed bottom-0 left-0">
      <div className="d-flex justify-content-between align-items-center w-100">
        <ShoutoutButton data={data} setData={setData} hideShoutout={hideShoutout} />
        <QuestionButton data={data} />
      </div>
    </footer>
  )
};

export default Footer;