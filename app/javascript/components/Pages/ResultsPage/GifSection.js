import React from "react"
import isEmpty from "ramda/src/isEmpty";
import {sortImagesByHeight} from "../../helpers/helpers";
import {MIN_USERS_RESPONSES} from "../../helpers/consts";
import PoweredBy from "../../../../assets/images/PoweredBy.svg";

const Wrapper = ({children}) => <div className='align-self-center gif-wrap result-page mb-3'>
  <div className='gif-result-card'>
    <div className='gif-result-card card'>
      <div className='card-body card-full'>
        <div className="gif-list">
          {children}
        </div>
      </div>
    </div>
  </div>
  <img src={PoweredBy} alt='PoweredBy' className={`big image-powered-by align-top`}/>
</div>

const PreviewGifSection = () => {
  const squareStyle = {
    backgroundColor: '#524F50',
    width: '100%',
    height: '125px',
    filter: 'blur(4px)',
    borderRadius: 6
  };
  const squares = [];

  for (let i = 0; i < 12; i++) {
    squares.push(<div className='gif-item result-page' key={i}>
      <div style={squareStyle} key={i}></div>
    </div>);
  }

  return <Wrapper>
    {squares}
  </Wrapper>
}

const GifSection = ({ gifs, isCurrentTimePeriod }) => {
  if(isEmpty(gifs)) return null

  if(isCurrentTimePeriod && gifs.length < MIN_USERS_RESPONSES) return <PreviewGifSection />

  const gifItems = sortImagesByHeight(gifs).map((gif, index) => {
    return <div className='gif-item result-page' key={index}>
      <img src={gif.src} alt={`gif ${index}`} />
    </div>
  });

  return <Wrapper>
    {gifItems}
  </Wrapper>
};

export default GifSection
