import React, {useEffect, useState} from 'react';
import {updateResponse} from "../requests/axios_requests";
import {isEmpty} from "../helpers/helper";
import {useNavigate} from   "react-router-dom";
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