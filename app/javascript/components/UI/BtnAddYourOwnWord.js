import React from 'react';
import styles from './BtnAddYourOwnWord.module.css'

const BtnAddYourOwnWord = (props) => {
    return (
        <Button
            className={styles.button}
            onClick={clickHandler}>
            Add your own word
        </Button>
    );
};

export default BtnAddYourOwnWord;