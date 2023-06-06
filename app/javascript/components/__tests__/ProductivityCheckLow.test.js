import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductivityCheckLow from '../Pages/ProductivityCheckLow';
import {MemoryRouter} from 'react-router-dom';

const mockService = {
    isLoading: false,
    error: null,
  };
  
  const data = {
    response: {
      attributes: {
        productivity: 0,
      },
    },
  };
  const setData = jest.fn();
  
  describe('ProductivityCheckLow', () => {
    test('checking components for crashing', () => {
      render(
        <MemoryRouter>
            <ProductivityCheckLow data={data} setData={setData} saveDataToDb={() => {}} steps={[]} service={mockService} draft={false} />
        </MemoryRouter>
        );
    });
  
    test('reproduces  page productivity', () => {
      render(
        <MemoryRouter>
            <ProductivityCheckLow data={data} setData={setData} saveDataToDb={() => {}} steps={[]} service={mockService} draft={false} />
        </MemoryRouter>
        );
      expect(screen.getByText('How productive have you been feeling recently?')).toBeInTheDocument();
      expect(screen.getByText('Use the slider')).toBeInTheDocument();
    });
  
    test('productivity value changes on input', () => {
      render(
        <MemoryRouter>
            <ProductivityCheckLow data={data} setData={setData} saveDataToDb={() => {}} steps={[]} service={mockService} draft={false} />
        </MemoryRouter>
        );
      const productivity = screen.getByRole('slider');
      fireEvent.change(productivity, { target: { value: 5 } });
      expect(productivity.value).toBe('5');
    });  
  });