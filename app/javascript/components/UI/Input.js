import React from 'react';

// TODO: do not use
const Input = (props) => {
    return (
        <label>
            {props.label}
        <input
            type={"text" || props.type}
            placeholder={props.placeholder}
        />
        </label>
    );
};

export default Input;