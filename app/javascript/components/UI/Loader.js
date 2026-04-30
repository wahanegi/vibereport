import React from "react";
import { ColorRing } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center z-5">
      <ColorRing />
    </div>
  )
}

export default Loader
