import React from "react";
import { ColorRing } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="position-fixed top-50 start-50 translate-middle">
      <ColorRing />
    </div>
  )
}

export default Loader