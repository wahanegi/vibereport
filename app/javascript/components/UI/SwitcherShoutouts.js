import iconPublic from "../../../assets/images/icon_public.svg";
import iconPrivate from "../../../assets/images/icon_private.svg";
import React from "react";

const SwitcherShoutouts = ({ isChecked, handleCheckboxChange }) => {

  return(
    <div>
       <label className="d-flex flex-column switcher-shoutout">
         <input
           type="checkbox"
           checked={isChecked}
           onChange={handleCheckboxChange}
         />
         <span className="slider-shoutout">
           <img src={isChecked ? iconPublic : iconPrivate}
                alt={isChecked ? 'public' : 'private'}/>
         </span>
         <span className="d-inline-block">
           <h4 className="switcher-title">{isChecked ? 'Public post' : 'Tagged only'}</h4>
         </span>
       </label>
    </div>
  )
}

export default SwitcherShoutouts;