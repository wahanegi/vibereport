import React from 'react';
import Logo from './UI/Logo';
import Menu from './UI/Menu';

const Header = ({data, steps, draft, handleSaveDraft, saveDataToDb, isResult = false}) => {
  return (
    <header
      className="container-fluid d-flex flex-nowrap align-items-center justify-content-between pt-1 pt-sm-2 px-1 px-sm-4">
      <div className="flex-shrink-1">
        <Logo/>
      </div>
      <div className="d-flex justify-content-end flex-grow-1">
        <Menu
          saveDataToDb={saveDataToDb}
          steps={steps}
          draft={draft}
          data={data}
          handleSaveDraft={handleSaveDraft}
          isResult={isResult}
        />
      </div>
    </header>
  );
};

export default Header;
