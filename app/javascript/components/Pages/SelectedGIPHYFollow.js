import React from 'react';
import {backHandling} from "../helpers/helpers";
import {BigBtnEmotion, BtnBack, BtnNext, LeftPanel, RightPanel} from "../UI/ShareContent";

const SelectedGiphyFollow = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const gif_url = data.response.attributes.gif_url

  const handlingOnClickNext = () => {
    steps.push('emotion-intensity')
    saveDataToDb( steps, {})
  }

  const Footer = () => <div className='d-flex justify-content-between'>
    <BtnBack onClick={backHandling} addClass='m-1' />
    <BtnNext onClick={handlingOnClickNext} addClass='m-1' />
  </div>

  if (!!error) return <p>{error.message}</p>

  return !isLoading && <div className="row text-center">
    <LeftPanel />
    <div className='col-8'>
      <div className="d-flex flex-column" style={{height: '90vh'}}>
        <div className="p-2">
          <h1 style={{marginTop: 140}}>Excellent choice!</h1>
          <h3 className='muted'>You uploaded:</h3>
          <img src={gif_url} alt='Giphy image' className='gif-image' />
          <div className='mt-2 text-center'>
            <BigBtnEmotion showPencil={false} emotion={data.emotion} />
          </div>
        </div>
        <div className="mt-auto p-2">
          <Footer />
        </div>
      </div>
    </div>
    <RightPanel />
  </div>
};

export default SelectedGiphyFollow;