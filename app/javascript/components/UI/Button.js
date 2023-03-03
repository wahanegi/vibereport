import React from 'react';
import classes from ''

const Button = (props) => {
    return (
        <div>
            <button type={props.type || 'button'}
                    className={classes.button && props.className}
                    onClick={props.click}>props.children
            </button>
        </div>
    );
};

export default Button;