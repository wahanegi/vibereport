import React, {Fragment} from "react";

const MemeSelection = ({emotion}) => {
  return <Fragment>
    <h2>Meme Selection Page</h2>
    <h4>{emotion.word}</h4>
  </Fragment>
}

export default MemeSelection;