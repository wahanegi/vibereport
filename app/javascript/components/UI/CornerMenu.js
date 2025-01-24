import React, {useContext} from 'react';
import DataContext from "../store/DataContext";
import {Dropdown} from "react-bootstrap";
import complete0 from "../../../assets/images/complete0.svg";
import Button from "./Button";

const CornerMenu = () => {
  const { data } = useContext(DataContext);
  const { response: { attributes: {draft, steps}} } = data;
  // check that url path contains "result"
  const isResult = window.location.href.includes('result');
  const lastStep = isResult ? 'results' : steps[steps.length - 1];
  const isLastStepDisabled = ['emotion-entry', 'emotion-selection-web', 'results', 'rather-not-say', 'skip-ahead'].includes(lastStep);

  const handleToggle = () => {}

  const handleSaveDraft = () => {}

  const handleSignOut = () => {}

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle  id='dropdown-stick'>
          <img src={complete0} alt='complete' />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#" >
            <Button className={`btn-item-menu wb1 mx-auto my-auto${draft || isLastStepDisabled ? ' disabled-btn-draft' : ''}`}
                    disabled={draft || isLastStepDisabled} onClick={handleSaveDraft}>
              Save Draft
            </Button>
          </Dropdown.Item>
          <Dropdown.Item href="#" ><Button className='btn-item-menu wb1  mx-auto my-auto' onClick={handleSignOut}>Log Out</Button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default CornerMenu;