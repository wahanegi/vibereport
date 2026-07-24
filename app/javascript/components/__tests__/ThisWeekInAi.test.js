import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import ThisWeekInAi from "../Pages/ThisWeekInAi";

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

const thisWeekInAiProps = {
  data,
  setData,
  saveDataToDb: () => {},
  steps: [],
  service: mockService,
  draft: false,
};

  describe('ThisWeekInAi', () => {
    test('checking components for crashing', () => {
      render(
        <MemoryRouter>
          <ThisWeekInAi {...thisWeekInAiProps} />
        </MemoryRouter>
        );
    });

    it('reproduces the AI question page', () => {
      render(
        <MemoryRouter>
          <ThisWeekInAi {...thisWeekInAiProps} />
        </MemoryRouter>
        );
      expect(screen.getByText('What was your most memorable interaction with AI this week?')).toBeInTheDocument();
    });
  });
