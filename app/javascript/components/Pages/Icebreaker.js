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
        <div className='d-flex justify-content-center'>
          <h1>Kick back, relax.</h1>
          <h1>Time for question of the week!</h1>
        </div>
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