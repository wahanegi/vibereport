import React from 'react';

const Backdrop = ({onClose}) => {
    return <div className='backdrop' onClick={ onClose }/>
};

export default Backdrop;