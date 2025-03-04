import React, {Fragment} from 'react';
import ShoutoutButton from "./ShoutoutButton";
import Menu from "./Menu";

const CornerElements = ({
                            data,
                            setData,
                            numShoutouts = 0,
                            isMoveShoutout,
                            saveDataToDb,
                            steps,
                            draft,
                            disabled,
                            hideBottom = false,
                            isResult = false,
                            hideShoutout = false,
                            handleSaveDraft }) => {
  return (
    <Fragment>
      {
        !hideBottom ?
          <Fragment>
            <ShoutoutButton data={data}
                            setData={setData}
                            num={numShoutouts}
                            isMove={isMoveShoutout}
                            hideShoutout={hideShoutout} />
          </Fragment> :
        null
      }

      <Menu saveDataToDb={saveDataToDb}
            steps={steps} draft={draft}
            disabled={disabled}
            data={data}
            handleSaveDraft={handleSaveDraft}
            isResult={isResult}
            className='placement-menu'/>
    </Fragment>
  );
};

export default CornerElements;