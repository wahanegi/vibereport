import React from 'react';

const MessageYesNoOk = ({content, onClick, onClose, isNoYesIsNotOk = true}) => {
  return (
    <div
      className='placement-modal-message position-fixed top-50 start-50 translate-middle bg-white border border-4 border-primary rounded-4 p-2 w-100 my-2'>
      {isNoYesIsNotOk && <div className='fs-2 mt-2'>{content}</div>}

      {!isNoYesIsNotOk && <div className='fs-2 w-100 mt-1'><span className='text-block'>{content}</span></div>}

      <div className={`mt-${isNoYesIsNotOk ? 6 : 0} d-flex justify-content-around gap-2`}>
        {isNoYesIsNotOk &&
          <button className='btn btn-modal c1 bg-gray-200 bg-gray-hover-200' onClick={onClose}>No, go back</button>}
        {isNoYesIsNotOk && <button className='btn btn-modal c1 bg-danger' onClick={onClick}>Yes, delete</button>}
        {!isNoYesIsNotOk && <button className='btn btn-modal c1 ok' onClick={onClick}>OK</button>}
      </div>
    </div>
  )
};

export default MessageYesNoOk;