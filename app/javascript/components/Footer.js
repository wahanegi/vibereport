import React from 'react';
import ShoutoutButton from './UI/ShoutoutButton';
import QuestionButton from './UI/QuestionButton';

const Footer = ({ data, setData, hideShoutout }) => {
  return <footer className='d-flex justify-content-between p-1 w-100 align-items-center'>
    <ShoutoutButton data={data} setData={setData} hideShoutout={hideShoutout} />
    <QuestionButton data={data} />
  </footer>
};

export default Footer;