import React from 'react';
import Logo from "./UI/Logo";
import CornerMenu from "./UI/CornerMenu";

const Header = () => {
  return (
    <header className="header">
      <Logo />
      <CornerMenu />
    </header>
  );
};

export default Header;