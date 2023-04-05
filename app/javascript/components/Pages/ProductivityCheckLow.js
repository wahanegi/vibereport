import React, {useState} from 'react';
import {Footer, Header, Wrapper} from "../UI/ShareContent";
import flame2 from '../../../assets/images/flame2.svg';
import flame3 from '../../../assets/images/flame3.svg';
import flame4 from '../../../assets/images/flame4.svg';
import flame5 from '../../../assets/images/flame5.svg';
import flame6 from '../../../assets/images/flame6.svg';
import flame7 from '../../../assets/images/flame7.svg';
import flame8 from '../../../assets/images/flame8.svg';
import flame9 from '../../../assets/images/flame9.svg';
import flame10 from '../../../assets/images/flame10.svg';

const ProductivitySlider = ({productivity, handleSliderChange, flameImages, generateStyles, imageSizes}) => 
<section>
    <div className="productivity-container">
      <form>
        <label htmlFor="productivity-slider" className="form-label">What is your productivity level for this time period?</label>
        <br />     
        {productivity > 0 && (
          <img
            src={flameImages[productivity-1]}
            alt={`Productivity flame level ${productivity}`}
            style={generateStyles(imageSizes[productivity - 1])}
            className="image-container"
          />
        )}
        <br />
        <input
          type="range"
          min="0"
          max="9"
          defaultValue={productivity}
          onChange={handleSliderChange}
          id="productivity-slider"
          className={`form-range level-${productivity}`}
        /> 
      </form>
    </div>
  </section>
const ProductivityCheckLow = ({data, setData, saveDataToDb, steps, service}) => {
  const {isLoading, error} = service
  const [productivity, setProductivity] = useState(0); 
  
  
  const handlingOnClickNext = () => {
    steps.push('ProductivityBadFollowUp');
    saveDataToDb(steps, { productivity: productivity });
  };

  const handleSliderChange = (event) => {
    event.preventDefault()
    const newProductivity = event.target.value;
    console.log(event.target.value);
    if (newProductivity <= 9) {
    setProductivity(newProductivity);
    } 
    console.log('productivity', productivity);
  };

  const flameImages = [flame2, flame3, flame4, flame5, flame6, flame7, flame8, flame9, flame10];

  const imageSizes = [
    {width: '55px', height: '70px'},
    {width: '84px', height: '98px'},
    {width: '145px', height: '134px'},
    {width: '169px', height: '159px'},
    {width: '185px', height: '196px'},
    {width: '208px', height: '253px'},
    {width: '211px', height: '239px'},
    {width: '221px', height: '271px'},
    {width: '382px', height: '297px'},
    ];
  
  const generateStyles = (size) => ({
    width: size.width,
    height: size.height,
  });

  
  if (!!error) return <p>{error.message}</p>

  return !isLoading && <Wrapper>
    <Header />
    <div className='central-element'>
      <ProductivitySlider productivity={productivity} handleSliderChange={handleSliderChange} flameImages={flameImages} generateStyles={generateStyles} imageSizes={imageSizes}/>
    </div>
    <Footer nextClick={handlingOnClickNext} disabled={productivity == 0}/>
  </Wrapper>
};

export default ProductivityCheckLow;