import iconPublic from '../../../assets/images/icon_public.svg';
import iconPrivate from '../../../assets/images/icon_private.svg';
import React from 'react';

const SwitcherShoutouts = ({ isChecked, handleCheckboxChange }) => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <label className="position-relative d-flex align-items-center switcher-shoutout">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span className="slider-shoutout position-absolute">
          <img
            src={isChecked ? iconPublic : iconPrivate}
            alt={isChecked ? 'public' : 'private'}
          />
        </span>
      </label>
      <h4 className="fs-6 ms-2 mt-1">{isChecked ? 'Public post' : 'Tagged only'}</h4>
    </div>
  );
};

export default SwitcherShoutouts;
