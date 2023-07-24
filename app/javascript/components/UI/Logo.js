import React, {useEffect, useState} from "react";
import axios from "axios";
import default_logo from "../../../assets/images/logo.svg"
import {isPresent} from "../helpers/helpers";

const Logo = () => {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    axios.get('/api/v1/logo')
      .then((response) => {
        setLogoUrl(isPresent(response.data) ? response.data : default_logo);
      })
      .catch((error) => {console.error('Error fetching logo:', error);});
  }, []);

  return <div className="board position-absolute t-35">
    <div className="bigger ml-41">
      <img src={logoUrl} alt="Logo" style={{maxHeight: 87}} />
    </div>
  </div>
};

export default Logo
