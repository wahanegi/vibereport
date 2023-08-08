import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import ProductivityBadFollowUp from "../Pages/ProductivityBadFollowUp";

const mockService = {
  isLoading: false,
  error: null,
};
  
const data = {
  response: {
    attributes: {
      productivity_comment: "",
    },
  },
};
const setData = jest.fn();

const productivityBadFollowUpProps = {
  data,
  setData,
  saveDataToDb: () => {},
  steps: [],
  service: mockService,
  draft: false,
};

describe('ProductivityBadFollowUp', () => {
  test('checking components for crashing', () => {
    render(
      <MemoryRouter>
        <ProductivityBadFollowUp {...productivityBadFollowUpProps} />
      </MemoryRouter>
      );
  });

  it('render page ProductivityBadFollowUp', () => {
    render(
      <MemoryRouter>
        <ProductivityBadFollowUp {...productivityBadFollowUpProps} />
      </MemoryRouter>
      );
    expect(screen.getByText('It\'s like that sometimes...')).toBeInTheDocument();
    expect(screen.getByText('Reflect on what you think limited your productivity...')).toBeInTheDocument();
  });

  it('should update the bad_follow_comment state when the comment input is changed', () => {
    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <ProductivityBadFollowUp {...productivityBadFollowUpProps} />
      </MemoryRouter>
    );
    const commentInput = getByPlaceholderText('Is there anything that we can do to help?');
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });
    expect(commentInput.value).toBe('Test comment');
  });
});
