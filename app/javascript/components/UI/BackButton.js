import React from 'react';
import {backHandling} from "../helpers/helper";
import {Button} from "react-bootstrap";

const BackButton = ({data, setData}) => <Button onClick={backHandling}>Back</Button>

export default BackButton;