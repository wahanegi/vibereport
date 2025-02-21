import React from 'react';
import iconPrivate from '../../../assets/images/icon_private.svg';
import iconPublic from '../../../assets/images/icon_public.svg';

const SwitcherShoutouts = ({isChecked, handleCheckboxChange}) => {
  return (
    <div className="d-flex align-items-center justify-content-center gap-1">
      <label className="position-relative d-flex align-items-center switcher-shoutout">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span className="slider-shoutout position-absolute pointer top-0 start-0 bottom-0 end-0">
          <img
            src={isChecked ? iconPublic : iconPrivate}
            alt={isChecked ? 'public' : 'private'}
          />
        </span>
      </label>
      <div className="fs-6">{isChecked ? 'Public post' : 'Tagged only'}</div>
    </div>
  );
};

export default SwitcherShoutouts;
