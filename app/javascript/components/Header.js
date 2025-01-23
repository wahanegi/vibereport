import React from 'react';
import Logo from './UI/Logo';
import Menu from './UI/Menu';

const Header = ({ data, steps, draft, handleSaveDraft, saveDataToDb }) => {
  return (
    <header className="header">
      <Logo />
      <Menu
        saveDataToDb={saveDataToDb}
        steps={steps}
        draft={draft}
        data={data}
        handleSaveDraft={handleSaveDraft}
        className="placement-menu"
      />
    </header>
  );
};

export default Header;
