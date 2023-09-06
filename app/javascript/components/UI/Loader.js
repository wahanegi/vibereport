import React from "react";
import {ColorRing} from "react-loader-spinner";

const Loader = () => {
  const centeredStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };

  return <div style={centeredStyle}>
    <ColorRing />
  </div>
}

export default Loader
