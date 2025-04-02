import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import ShoutoutButton from './UI/ShoutoutButton';

const Layout = ({
                  children,
                  data,
                  setData,
                  numShoutouts = 0,
                  saveDataToDb,
                  steps,
                  draft,
                  isResult = false,
                  hideShoutout = false,
                  handleSaveDraft,
                }) => {
  const location = useLocation();
  const isRecognitionPage = location.pathname.match('recognition');

  return (
    <>
      <Header data={data} steps={steps} draft={draft} handleSaveDraft={handleSaveDraft} saveDataToDb={saveDataToDb}
              isResult={isResult}/>

      <div className={'position-relative'}>
        <main
          className="flex-grow-1 d-flex justify-content-center align-items-start fixed-button-offset"
          role="main">
          {children}
        </main>

        <div className={'position-fixed bottom-0 end-0 pb-1 pe-1'} style={{ zIndex: 10 }}>
          {!isRecognitionPage &&
            <ShoutoutButton data={data} setData={setData} hideShoutout={hideShoutout} num={numShoutouts}/>}
        </div>
      </div>
    </>
  );
};

export default Layout;
