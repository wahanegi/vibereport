import iconPublic from '../../../assets/images/icon_public.svg';
import iconPrivate from '../../../assets/images/icon_private.svg';
import React from 'react';

const SwitcherShoutouts = ({ isChecked, handleCheckboxChange }) => {

  return(
    <div className='d-flex align-items-center'>
       <label className="position-relative d-flex align-items-center switcher-shoutout">
         <input
           type="checkbox"
           checked={isChecked}
           onChange={handleCheckboxChange}
         />
         <span className="slider-shoutout position-absolute">
           <img src={isChecked ? iconPublic : iconPrivate}
                alt={isChecked ? 'public' : 'private'}/>
         </span>
         <span className="d-inline-block position-relative placement-switcher-title">
           <h4 className="fs-6">{isChecked ? 'Public post' : 'Tagged only'}</h4>
         </span>
       </label>
    </div>
  );
};

export default SwitcherShoutouts;
