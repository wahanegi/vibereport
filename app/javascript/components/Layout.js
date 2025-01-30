import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({
  children,
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
  handleSaveDraft,
}) => {
  return (
    <div className="d-flex flex-row vh-100">
      <Header data={data} steps={steps} draft={draft} handleSaveDraft={handleSaveDraft} saveDataToDb={saveDataToDb} />
      <main className="flex-grow-1 d-flex flex-row overflow-auto pb-10" role="main">
        {children}
      </main>
      <Footer
        data={data}
        setData={setData}
        hideShoutout={hideShoutout}
        numShoutouts={numShoutouts}
        isMoveShoutout={isMoveShoutout}
      />
    </div>
  );
};

export default Layout;
