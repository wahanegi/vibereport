import React from "react";
import default_logo from "../../../assets/images/logo.png"

const Logo = ({ href = null }) => {
  const img = <img src={default_logo} alt="Logo" className="img-fluid" style={{ maxHeight: 87 }} />;

  return href ? <a href={href}>{img}</a> : img;
};

export default Logo
