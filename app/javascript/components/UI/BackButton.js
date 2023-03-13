import React, {useEffect, useState} from 'react';
import {updateResponse} from "../requests/axios_requests";
import {isEmpty} from "../helpers/helper";
import {useNavigate} from   "react-router-dom";
import {Button} from "react-bootstrap";



const BackButton = ({data, setData}) => {
  const [response, setResponse] = useState(data.response)
  const navigate = useNavigate()
  const steps = JSON.parse(data.response.attributes.step)
  const backHandling = () => {
    // let steps = JSON.parse(data.response.attributes.step)
    steps.pop()
    console.log(" backHandling steps = ", steps)
    const updatedResponse = {
      ...data.response,
      attributes: {
        ...data.response.attributes,
        step: JSON.stringify(steps)
      }
    }
    console.log(" backHandling updatedResponse = ", updatedResponse)
    setData({...data, response: {...data.response, attributes: {...updatedResponse.attributes}}})
    updateResponse(updatedResponse, setResponse)
  }
  useEffect(()=>{
    if(!isEmpty(response)){
      console.log("/app", response.attributes)
// window.location.back();
      navigate(`/${JSON.parse(response.attributes.step).pop()}`);//, { replace: true }
      // window.location.replace(`/${JSON.parse(response.attributes.step).pop()}`);
    }
  },[response])
  return (
<Button onClick={backHandling}>Back</Button>
  );
};

export default BackButton;