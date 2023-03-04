import React from 'react';
import {Button} from "react-bootstrap";
import {updateResponse} from "../requests/axios_requests";

const EmotionEntry = ({response, setResponse}) => {
  const toMemeSelection = () => {
    response.attributes['step'] = 'MemeSelection'
    updateResponse(response, setResponse)
  }
  const toResults = () => {
    response.attributes['step'] = 'Results'
    updateResponse(response, setResponse)
  }

  return <div>
    <h2>Emotion Entry Page</h2>
    <p>No emotion was clicked</p>
    <Button className='m-2' onClick={toMemeSelection}>
      Go to Meme Selection
    </Button>
    <Button className='m-2' onClick={toResults}>
      Go to Results
    </Button>
  </div>
}
export default EmotionEntry;
