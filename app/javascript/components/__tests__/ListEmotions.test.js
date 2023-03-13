import React from 'react';
import { render, screen } from '@testing-library/react';
import ListEmotions from "../Pages/ListEmotions";
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'


describe('App component', () => {
  it('should render ListEmotions component when the path is "/app"', () => {
    render(
      <MemoryRouter>
        <ListEmotions />
      </MemoryRouter>
    );
    expect(screen.getByText("...Loading")).toBeInTheDocument();
  });
});