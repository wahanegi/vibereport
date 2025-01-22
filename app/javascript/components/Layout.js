import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({children}) => {
  return (
    <div className="vh-100">
      <Header />
        <main className="flex-grow-1 d-flex flex-row" role="main">
          {children}
        </main>
      <Footer />
    </div>
  );
};

export default Layout;