import React from "react";
import { ColorRing } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <ColorRing />
    </div>
  )
}

export default Loader
