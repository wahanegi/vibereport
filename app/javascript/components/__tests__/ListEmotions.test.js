import React from 'react';
import { render, screen } from '@testing-library/react';
import ListEmotions from "../Pages/ListEmotions";
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'


describe('ListEmotions component', () => {
  it('should render ListEmotions component when the path is "/emotion-selection-web"', () => {
    const mockService = { isLoading: false, error: null };
    const data = {
      emotion_id: 1,
      time_period: { id: 2 },
      current_user_id: 3,
      data: 
      [
        {id: 1, type: "emotion", attributes: { word: "Satisfied", category: "positive" }},
        {id: 2, type: "emotion", attributes: { word: "Enthusiastic", category: "positive" }},
        {id: 3, type: "emotion", attributes: { word: "Excited", category: "positive" }},
        {id: 4, type: "emotion", attributes: { word: "Energetic", category: "positive" }},
        {id: 5, type: "emotion", attributes: { word: "Happy", category: "positive" }},
        {id: 6, type: "emotion", attributes: { word: "Joyful", category: "positive" }},
        {id: 7, type: "emotion", attributes: { word: "Inspired", category: "positive" }},
        {id: 8, type: "emotion", attributes: { word: "Proud", category: "positive" }},
        {id: 9, type: "emotion", attributes: { word: "Confident", category: "positive" }},
        {id: 10, type: "emotion", attributes: { word: "Belonging", category: "positive" }},
        {id: 11, type: "emotion", attributes: { word: "Amazing", category: "positive" }},
        {id: 12, type: "emotion", attributes: { word: "Great", category: "positive" }},

        {id: 13, type: "emotion", attributes: { word: "Relaxed", category: "neutral" }},
        {id: 14, type: "emotion", attributes: { word: "Peaceful", category: "neutral" }},
        {id: 15, type: "emotion", attributes: { word: "Calm", category: "neutral" }},
        {id: 16, type: "emotion", attributes: { word: "Serene", category: "neutral" }},
        {id: 17, type: "emotion", attributes: { word: "Fine", category: "neutral" }},
        {id: 18, type: "emotion", attributes: { word: "Alright", category: "neutral" }},
        {id: 19, type: "emotion", attributes: { word: "Ok", category: "neutral" }},
        {id: 20, type: "emotion", attributes: { word: "Busy", category: "neutral" }},
        {id: 21, type: "emotion", attributes: { word: "Dull", category: "neutral" }},
        {id: 22, type: "emotion", attributes: { word: "Slow", category: "neutral" }},
        {id: 23, type: "emotion", attributes: { word: "Easy", category: "neutral" }},
        {id: 24, type: "emotion", attributes: { word: "Surprised", category: "neutral" }},

        {id: 25, type: "emotion", attributes: { word: "Frustrated", category: "negative" }},
        {id: 26, type: "emotion", attributes: { word: "Stressed", category: "negative" }},
        {id: 27, type: "emotion", attributes: { word: "Anxious", category: "negative" }},
        {id: 28, type: "emotion", attributes: { word: "Worried", category: "negative" }},
        {id: 29, type: "emotion", attributes: { word: "Angry", category: "negative" }},
        {id: 30, type: "emotion", attributes: { word: "Disappointed", category: "negative" }},
        {id: 31, type: "emotion", attributes: { word: "Exasperated", category: "negative" }},
        {id: 32, type: "emotion", attributes: { word: "Annoyed", category: "negative" }},
        {id: 33, type: "emotion", attributes: { word: "Bored", category: "negative" }},
        {id: 34, type: "emotion", attributes: { word: "Miserable", category: "negative" }},
        {id: 35, type: "emotion", attributes: { word: "Sad", category: "negative" }},
        {id: 36, type: "emotion", attributes: { word: "Tired", category: "negative" }},
      ]
   }
    
    render(
      <MemoryRouter>
        <ListEmotions service={mockService} data={data} setData={() => {}} saveDataToDb={() => {}} steps={{}}/>
      </MemoryRouter>
    );
    expect(screen.getByText("Which word best describes how you felt work this week?")).toBeInTheDocument();
  });
});