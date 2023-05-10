import React from "react";

const PreviewShoutoutSection = () =>
  <div className='results col'>
    <div className='row wrap shoutout preview mb-3' />
  </div>

const ShoutoutSection = ({nextTimePeriod}) => {
  if(!nextTimePeriod) return <PreviewShoutoutSection />

  return <div className='results col'>
    <div className='row wrap shoutout mb-3'>
      Will be shotouts
    </div>
  </div>
}

export default ShoutoutSection
