import React, { useState } from 'react';
import ShoutoutIcon from '../../../assets/images/sys_svg/shoutout-new.svg';
import ShoutoutModal from '../Pages/modals/ShoutoutModal';

const ShoutoutButton = ({ data, setData, hideShoutout }) => {
  if (hideShoutout) return;

  const [shoutOutForm, setShoutOutForm] = useState(false);

  return (
    <>
      <button
        className="border-0 bg-transparent"
        onClick={() => setShoutOutForm(true)}
      >
        <img src={ShoutoutIcon} alt="Shoutout" />
      </button>

      <ShoutoutModal
        shoutOutForm={shoutOutForm}
        setShoutOutForm={setShoutOutForm}
        data={data}
        setData={setData}
      />
    </>
  );
};

export default ShoutoutButton;