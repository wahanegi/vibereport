import React from 'react';
import {Button} from "react-bootstrap";

const BackButton = ({data, setData}) => {
  const backHandling = () => {
    window.history.back()
  }

  return (
<Button onClick={backHandling}>Back</Button>
  );
};

export default BackButton;