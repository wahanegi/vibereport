import React from 'react';
import BackButton from "../UI/BackButton";
import {Button} from "react-bootstrap";

const OwnMemeUploadFollow = ({data, setData}) => {
  const nextHandling = () => {

  }
  return (
    <div>
      <div>
        <h1>2.26 OwnMemeUploadFollow</h1>
      </div>
      <div>
        <h2>A new one ...Nice!</h2>
      </div>
      <div>
      <h3>You uploaded</h3>
      </div>
      <div>
        <Button className={data.response.attributes.category}>{data.response.attributes.word}</Button>
      </div>
      <div>
        <BackButton data={data} setData={setData}>Back</BackButton>
      </div>
      <div>
        |<Button onClick={nextHandling}>Next</Button>
      </div>
    </div>
  );
};

export default OwnMemeUploadFollow;