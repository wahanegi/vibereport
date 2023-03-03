import React from 'react';

const Input = (props) => {
    return (
        <label>
            props.label
        <input
            type={"text" || props.type}
            placeholder={props.placeholder}
        />
        </label>
    );
};

export default Input;