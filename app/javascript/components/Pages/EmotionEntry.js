import React, {Fragment} from 'react';
import NavigationButtons from '../UI/NavigationButtons';

const EmotionEntry =  ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service

  const handlingOnClickNext = () => {
    steps.push('meme-selection')
    saveDataToDb( steps, {})
  }
  //id:"1.1.", step:"emotion-entry"
  return (
    <Fragment>
      { !!error && <p>{error.message}</p>}
      { !isLoading && !error  &&
        <div>
          <div>
            <h2>No emotion was clicked</h2>
          </div> 
          <NavigationButtons data={data} setData={setData} handlingOnClickNext={handlingOnClickNext} />
        </div>}
    </Fragment>
  );
};

export default EmotionEntry;