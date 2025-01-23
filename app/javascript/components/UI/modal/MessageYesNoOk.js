import React from 'react';

const MessageYesNoOk = ({ content, onClick, onClose, isNoYesIsNotOk = true } ) => {
    return <div className = 'placement-modal-message'>
        {isNoYesIsNotOk && <div className='mt-8 fs-2'>{content}</div>}
        {!isNoYesIsNotOk && <div className='fs-2 w-100 mt-1'><span className='text-block'>{content}</span></div>}
        <div className={`mt-${isNoYesIsNotOk ? 6 : 0} d-flex justify-content-around`}>
            {isNoYesIsNotOk && <button className='btn btn-modal c1 bg-gray-200 bg-gray-hover-200' onClick={ onClose }>No, go back</button>}
            {isNoYesIsNotOk && <button className='btn btn-modal c1 bg-danger' onClick={ onClick }>Yes, delete</button>}
            {!isNoYesIsNotOk && <button className='btn btn-modal c1 ok' onClick={ onClick }>OK</button>}
        </div>
    </div>
};

export default MessageYesNoOk;