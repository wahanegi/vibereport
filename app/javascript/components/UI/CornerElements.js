import React, {Fragment} from 'react';
import QuestionButton from "./QuestionButton";
import ShoutoutButton from "./ShoutoutButton";
import Menu from "./Menu";
import {Logo} from "./ShareContent";

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
                            preview = null,
                            hideShoutout = false,
                            handleSaveDraft }) => {
  return (
    <Fragment>
      <Logo />
      {
        !hideBottom ?
          <Fragment>
            <QuestionButton data={data} />
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
            preview={preview}
            className='placement-menu'/>
    </Fragment>
  );
};

export default CornerElements;