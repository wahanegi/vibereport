import React from 'react';
import { render, screen } from '@testing-library/react';
import ListEmotions from "../Pages/ListEmotions";
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'


describe('ListEmotions component', () => {
  it('should render ListEmotions component when the path is "/emotion-selection-web"', () => {
    const mockService = { isLoading: false, error: null };
    render(
      <MemoryRouter>
        <ListEmotions service={mockService} data={{}} setData={() => {}} saveDataToDb={() => {}} steps={{}}/>
      </MemoryRouter>
    );
    expect(screen.getByText("Which word best describes ho you felt work this week?")).toBeInTheDocument();
  });
});