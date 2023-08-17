import iconPublic from "../../../assets/images/icon_public.svg";
import iconPrivate from "../../../assets/images/icon_private.svg"
import React from "react";

const SwitcherShoutouts = ({ isChecked, onCheckedChange }) => {

  const handleCheckboxChange = () => {
    const newChecked = !isChecked;
    onCheckedChange(newChecked);
  };

  return(
    <div>
       <label className="d-flex position-relative placement-shoutout-toggle switcher-shoutout">
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
           <h4 className="switcher-title">{isChecked ? 'Public post' : 'Tagged only'}</h4>
         </span>
       </label>
    </div>
  )
}

export default SwitcherShoutouts;