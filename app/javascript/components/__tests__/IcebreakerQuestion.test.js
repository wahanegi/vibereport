import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import IcebreakerQuestion from "../Pages/IcebreakerQuestion";

const mockService = {
  isLoading: false,
  error: null
};

const data = {
  current_user: {
    id: 1,
    first_name: 'Serhii'
  },
  response: {
    attributes: {},
  },
};
const setData = jest.fn();

describe('IcebreakerQuestion', () => {
  test('checking components for crashing', () => {
    render(
      <MemoryRouter>
        <IcebreakerQuestion data={data} setData={setData} service={mockService} />
      </MemoryRouter>
    );
  });

  it('reproduces page IcebreakerQuestion', () => {
    render(
      <MemoryRouter>
        <IcebreakerQuestion data={data} setData={setData} service={mockService} />
      </MemoryRouter>
    );
    expect(screen.getByText('Thanks for answering!')).toBeInTheDocument();
    expect(screen.getByText('Interested in submitting your own question to the team?')).toBeInTheDocument();
  });
});