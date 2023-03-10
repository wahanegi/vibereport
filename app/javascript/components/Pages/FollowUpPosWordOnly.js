import React from 'react';
import BackButton from "../UI/BackButton";
import {Button} from "react-bootstrap";

const FollowUpPosWordOnly = ({data, setData}) => {
  const nextHandling = () => {

  }
  return (
    <div>
      <div>
        <h1>3.1. FollowUpPosWordOnly</h1>
      </div>
      <div>
        <h2>Sensational week? Most excellent!</h2>
      </div>
      <div>
        <h3>Select how intense the feeling was</h3>
      </div>
      <div>
        <Button className={data.response.attributes.category}>{data.response.attributes.word}</Button>
      </div>
      <div>
        <BackButton data={data} setData={setData}>Back</BackButton>
      </div>
      <div>
        <Button onClick={nextHandling}>Next</Button>
      </div>
    </div>
  )
};

export default FollowUpPosWordOnly;