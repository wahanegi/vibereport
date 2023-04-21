import React, {useRef, useState} from 'react';
import { render, fireEvent } from '@testing-library/react';
import RichInputElement from "../UI/RichInputElement";


  describe('RichInputElement', ()=>{
    it('init entire word "Hi Team!"',() => {
      const { getByTestId } = render(
        <RichInputElement richText = 'Hi Team!' />
      );
      const divElement = getByTestId('editable-div');
      expect(divElement.innerHTML).toBe('Hi Team!');
    })

    it('init entire word "Hi Team!"',() => {
      const { getByTestId } = render(
        <RichInputElement
          richText = 'Hi Team!'
          listUsers = {[]}
          className = ""
          setChosenUsers = {()=>{}}
          setRichText = {()=>{}}
          onSubmit = {()=>{}}
        />
      );
      const divElement = getByTestId('editable-div');
      expect(divElement.innerHTML).toBe('Hi Team!');
    })
  })



