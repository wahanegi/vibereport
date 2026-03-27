import React from 'react';
import { isBlank } from '../../../helpers/helpers';

const ResponseHeader = ({
  userName = '',
  text = '',
  body = {},
  wrapperClass = '',
  label
}) => {
  if (isBlank(body)) return null;

  return (
    <div className={`row wrap ${wrapperClass} mb-1 mw-100`}>
      {userName && (
        <p className='b3 muted text-start fs-7 fs-md-6 mb-1'>
          {userName} {label}
          <br />
        </p>
      )}

      <p className='fs-7 fs-md-6 w-auto text-start fw-semibold lh-base'>
        {text}
      </p>
    </div>
  );
};

export default ResponseHeader;
