import React, {Fragment, useEffect} from "react";
import {Button} from "react-bootstrap";
import {updateResponse} from "../requests/axios_requests";

const MemeSelection = ({emotion, response, setResponse}) => {
  const toEmotionEntry = () => {
    response.attributes['step'] = 'EmotionEntry'
    updateResponse(response, setResponse)
  }
  const toResults = () => {
    response.attributes['step'] = 'Results'
    updateResponse(response, setResponse)
  }

  return <Fragment>
    <h2>Meme Selection Page</h2>
    <h4>{emotion.word}</h4>
    <Button className='m-2' onClick={toEmotionEntry}>
      Go to Emotion Entry
    </Button>
    <Button className='m-2' onClick={toResults}>
      Go to Results
    </Button>
  </Fragment>
}

export default MemeSelection;