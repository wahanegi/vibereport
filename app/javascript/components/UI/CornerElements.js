import React, {Fragment} from 'react';
import QuestionButton from "./QuestionButton";
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
                            handleSaveDraft }) => {
  return (
    <Fragment>
      <div className="board position-absolute t-35">
        <div className="convert bigger ml-41 " >
          <p className="position-relative color-black" >Logo/Brand</p>
          <div className="line1 offset-line1" ></div>
          <div className="line2 offset-line2"></div>
        </div>
      </div>
      <QuestionButton />
      <ShoutoutButton   data = { data }
                     setData = { setData }
                         num = { numShoutouts }
                      isMove = { isMoveShoutout }/>
      <Menu
            saveDataToDb={saveDataToDb}
            steps={steps} draft={draft}
            disabled={disabled}
            data={data}
            handleSaveDraft={handleSaveDraft}
            className='placement-menu'/>
    </Fragment>
  );
};

export default CornerElements;