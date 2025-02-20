import React, { useState, Fragment, useEffect } from 'react';
import flame2 from '../../../assets/images/flame2.svg';
import flame3 from '../../../assets/images/flame3.svg';
import flame4 from '../../../assets/images/flame4.svg';
import flame5 from '../../../assets/images/flame5.svg';
import flame6 from '../../../assets/images/flame6.svg';
import flame7 from '../../../assets/images/flame7.svg';
import flame8 from '../../../assets/images/flame8.svg';
import flame9 from '../../../assets/images/flame9.svg';
import flame10 from '../../../assets/images/flame10.svg';
import { FLAME_IMAGE_SIZES } from '../helpers/consts';
import { isBlank } from '../helpers/helpers';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import Layout from '../Layout';

const ProductivitySlider = ({
  productivity,
  handleSliderChange,
  flameImages,
  generateStyles,
  imageSizes,
}) => (
  <Fragment>
    <div className="d-flex flex-column align-items-center mt-2 mx-auto productivity-container">
      <form>
        <h1 className="mx-auto my-0 lh-1 text-black fs-3 fs-md-1">
          How productive have you been feeling recently?
        </h1>
        <div className="mx-1 mx-md-0">
          {productivity > 0 && (
            <div>
              <img
                src={flameImages[productivity - 1]}
                alt={`Productivity flame level ${productivity}`}
                style={generateStyles(imageSizes[productivity - 1])}
                className="img-fluid"
              />
            </div>
          )}
          <div>
            <input
              type="range"
              min="0"
              max="9"
              defaultValue={productivity}
              onChange={handleSliderChange}
              id="productivity-slider"
              className={`border-0 shadow-none form-range level-${productivity}`}
            />
            <p>Use the slider</p>
          </div>
        </div>
      </form>
    </div>
  </Fragment>
);
const ProductivityCheckLow = ({
  data,
  setData,
  saveDataToDb,
  steps,
  service,
  draft,
}) => {
  const { isLoading, error } = service;
  const [productivity, setProductivity] = useState(
    data.response.attributes.productivity || 0
  );
  const [isDraft, setIsDraft] = useState(draft);

  const handleSaveDraft = () => {
    const dataDraft = { productivity, draft: true };
    saveDataToDb(steps, dataDraft);
    setIsDraft(true);
  };

  useEffect(() => {
    const dataProductivity = data.response.attributes.productivity || 0;
    if (productivity !== dataProductivity && isDraft) {
      setIsDraft(false);
    }
  }, [productivity]);

  const handlingOnClickNext = () => {
    if (productivity < 3) {
      steps.push('productivity-bad-follow-up');
    } else {
      steps.push('causes-to-celebrate');
    }
    saveDataToDb(steps, { productivity, draft: false });
  };

  const handleSliderChange = (event) => {
    event.preventDefault();
    const newProductivity = parseInt(event.target.value, 10);
    if (newProductivity >= 0 && newProductivity <= 9) {
      setProductivity(newProductivity);
    }
  };

  const flameImages = [
    flame2,
    flame3,
    flame4,
    flame5,
    flame6,
    flame7,
    flame8,
    flame9,
    flame10,
  ];

  const imageSizes = FLAME_IMAGE_SIZES;

  const generateStyles = (size) => ({
    width: size.width,
    height: size.height,
    marginTop: size.marginTop,
  });

  if (!!error) return <p>{error.message}</p>;

  return (
    !isLoading && (
      <Layout
        data={data}
        setData={setData}
        saveDataToDb={saveDataToDb}
        steps={steps}
        draft={isDraft}
        handleSaveDraft={handleSaveDraft}
      >
        <div className="mx-auto w-100">
          <ProductivitySlider
            productivity={productivity}
            handleSliderChange={handleSliderChange}
            flameImages={flameImages}
            generateStyles={generateStyles}
            imageSizes={imageSizes}
          />
          <div className="mt-10">
            <BlockLowerBtns
              nextHandling={handlingOnClickNext}
              disabled={isBlank(productivity) || productivity === 0}
            />
          </div>
        </div>
      </Layout>
    )
  );
};

export default ProductivityCheckLow;
