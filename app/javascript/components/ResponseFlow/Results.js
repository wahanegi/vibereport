import React from 'react';
import {Button} from "react-bootstrap";
import {updateResponse} from "../requests/axios_requests";

const Results = ({response, setResponse}) => {
  const toMemeSelection = () => {
    response.attributes['step'] = 'MemeSelection'
    updateResponse(response, setResponse)
  }
  const toEmotionEntry = () => {
    response.attributes['step'] = 'EmotionEntry'
    updateResponse(response, setResponse)
  }

  return <div>
    <h2>Results Page</h2>
    <p>User was not working for this time period</p>
    <Button className='m-2' onClick={toMemeSelection}>
      Go to Meme Selection
    </Button>
    <Button className='m-2' onClick={toEmotionEntry}>
      Go to EmotionEntry
    </Button>
  </div>
}
export default Results;
