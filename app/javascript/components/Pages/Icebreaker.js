import React, {Fragment} from 'react';
import {backHandling} from "../helpers/helpers";
import {Wrapper, BtnBack, BtnNext, Header, ShoutOutIcon, HelpIcon} from "../UI/ShareContent";

const Icebreaker = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const handlingOnClickNext = () => {

  }
  if (!!error) return <p>{error.message}</p>
  console.log("data", data)
  return (
    <Fragment>
      <Wrapper>
        <Header />
        <h1>Icebreaker</h1>
        <div className='d-flex justify-content-between m-3'>
          <ShoutOutIcon />
            <BtnBack onClick={backHandling} />
            <BtnNext onClick={handlingOnClickNext} />
          <HelpIcon />
        </div>
      </Wrapper>
    </Fragment>
  );
};

export default Icebreaker;