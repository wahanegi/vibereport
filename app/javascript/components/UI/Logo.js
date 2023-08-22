import React from "react";
import default_logo from "../../../assets/images/logo.png"

const Logo = () => <div className="board position-absolute t-35">
  <div className="bigger ml-41">
    <img src={default_logo} alt="Logo" style={{maxHeight: 87}} />
  </div>
</div>

export default Logo
