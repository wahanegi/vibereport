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
      attributes: {},
    },
    current_user: {
      id: 1,
      first_name: 'Serhii',
      last_name: 'Petrov',
      not_ask_visibility: false
    },
    time_period: {
      id: 1
    },
    users: []
  };
  const setData = jest.fn();

const сausesToCelebrateProps = {
  data,
  setData,
  saveDataToDb: () => {},
  steps: [],
  service: mockService,
  draft: false,
};

  describe('CausesToCelebrate', () => {
    test('checking components for crashing', () => {
      render(
        <MemoryRouter>
          <CausesToCelebrate {...сausesToCelebrateProps} />
        </MemoryRouter>
        );
    });
  
    it('reproduces page celebrate', () => {
      render(
        <MemoryRouter>
          <CausesToCelebrate {...сausesToCelebrateProps} />
        </MemoryRouter>
        );
      expect(screen.getByText('Are there any recent causes to celebrate?')).toBeInTheDocument();
    });
  });
