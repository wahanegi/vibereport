import React from 'react';
import ShoutoutButton from './UI/ShoutoutButton';
import QuestionButton from './UI/QuestionButton';

const Footer = ({ data, setData, hideShoutout, numShoutouts }) => {
  return <footer className='d-flex container-fluid justify-content-between align-items-center py-1 py-sm-2'>
    <ShoutoutButton data={data} setData={setData} hideShoutout={hideShoutout} num={numShoutouts} />
    <QuestionButton data={data} />
  </footer>
};

export default Footer;