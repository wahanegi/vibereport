import React, {Fragment} from 'react';
import Form from 'react-bootstrap/Form'
import {backHandling} from "../helpers/helpers";
import {Wrapper, BtnBack, BtnNext, Header, ShoutOutIcon, HelpIcon} from "../UI/ShareContent";

const Icebreaker = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const handlingOnClickNext = () => {

  }
  if (!!error) return <p>{error.message}</p>
  console.log("data", data)
  return (
    <Fragment className='icebreaker'>
      <Wrapper>
        <Header/>
        <div className='d-flex justify-content-center flex-column'>
          <h1 className='mb-0'>Kick back, relax.</h1>
          <h1 className='mb-3'>Time for question of the week!</h1>
          <h2 className='icebreaker'>Brought to us by <span style={{ color: '#E02AA4' }}>@</span>mike</h2>
        </div>
        <div className='wrap-question'>
          <p className='b3 tag-name'><span style={{ color: '#E02AA4' }}>@</span>mike asks:</p>
          <p className='text-question'>Which would you rather fight? A Danny Devito-sized dachsund, or 5 dachsund-sized Danny DeVitos?</p>
          <div>
            <form>
              <div className="form-group">
              <textarea
                className="input-answer"
                placeholder="Tell us what you think!"
                maxLength={700}
              />
              </div>
            </form>
        </div>
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