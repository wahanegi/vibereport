import React from 'react';
import ShoutoutButton from './UI/ShoutoutButton';

const Footer = ({ data, setData, hideShoutout, numShoutouts }) => {
  return <footer className='d-flex container-fluid justify-content-between align-items-center py-1 py-sm-2'>
    <ShoutoutButton data={data} setData={setData} hideShoutout={hideShoutout} num={numShoutouts} />
  </footer>
};

export default Footer;