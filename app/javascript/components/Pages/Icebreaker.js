import React, {Fragment} from 'react';
import Form from 'react-bootstrap/Form'
import 'icebreaker.scss';
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
        <Header/>
        <div className='d-flex justify-content-center flex-column icebreaker'>
          <h1 className='mb-0'>Kick back, relax.</h1>
          <h1 className='mb-3'>Time for question of the week!</h1>
          <h2>Brought to us by @mike</h2>
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