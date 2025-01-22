import React from 'react';
import ShoutoutButton from './UI/ShoutoutButton';
import QuestionButton from './UI/QuestionButton';

const Footer = ({ data, setData, hideShoutout }) => {
  return (
    <footer className="container py-3">
      <div className="d-flex justify-content-between align-items-center">
        <ShoutoutButton data={data} setData={setData} hideShoutout={hideShoutout} />
        <QuestionButton data={data} />
      </div>
    </footer>
  )
};

export default Footer;