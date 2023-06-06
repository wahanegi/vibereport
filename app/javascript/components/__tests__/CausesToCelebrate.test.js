import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import CausesToCelebrate from "../Pages/CausesToCelebrate";

const mockService = {
    isLoading: false,
    error: null,
  };
  
  const data = {
    response: {
      attributes: {
        celebrate_comment: "",
      },
    },
  };
  const setData = jest.fn();
  
  describe('CausesToCelebrate', () => {
    test('checking components for crashing', () => {
      render(
        <MemoryRouter>
          <CausesToCelebrate data={data} setData={setData} saveDataToDb={() => {}} steps={[]} service={mockService} draft={false} />
        </MemoryRouter>
        );
    });
  
    it('reproduces page celebrate', () => {
      render(
        <MemoryRouter>
            <CausesToCelebrate data={data} setData={setData} saveDataToDb={() => {}} steps={[]} service={mockService} draft={false} />
        </MemoryRouter>
        );
      expect(screen.getByText('Are there any recent causes to celebrate?')).toBeInTheDocument();
    });

    it('should update the celebrateComment state when the comment input is changed', () => {
      const { getByPlaceholderText } = render(
        <MemoryRouter>
          <CausesToCelebrate data={data} setData={setData} saveDataToDb={() => {}} steps={[]} service={mockService} draft={false} />
        </MemoryRouter>
      );
      const commentInput = getByPlaceholderText('Are you grateful for anything that happened at work recently?');
      fireEvent.change(commentInput, { target: { value: 'Test comment' } });
      expect(commentInput.value).toBe('Test comment');
    });
  });
