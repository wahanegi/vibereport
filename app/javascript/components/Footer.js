import React from 'react';
import { useLocation } from "react-router-dom";
import ShoutoutButton from './UI/ShoutoutButton';

const Footer = ({ data, setData, hideShoutout, numShoutouts }) => {
  const location = useLocation();
  const isRecognitionPage = location.pathname.match("recognition");

  return <footer className='d-flex justify-content-between p-1 w-100 align-items-center'>
    {!isRecognitionPage && <ShoutoutButton data={data} setData={setData} hideShoutout={hideShoutout} num={numShoutouts} />}
  </footer>
};

export default Footer;