import React, {useState} from 'react';
import { render, screen } from '@testing-library/react';
import ListEmotions from "../Pages/ListEmotions";
import {MemoryRouter, useNavigate} from 'react-router-dom';
import '@testing-library/jest-dom'


describe('ListEmotions component', () => {
  it('data from server should be in this format when user doing first entry on ',()=>{
    // const [data, setData] = useState({})
    // apiRequest("GET", data, ()=>{},()=>{}, '/emotionc.json')
    // expect(await screen.findAllByRole('',{},{})).toBeInTheDocument();
  })
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

        {id: 13, type: "emotion", attributes: { word: "Frustrated", category: "negative" }},
        {id: 14, type: "emotion", attributes: { word: "Stressed", category: "negative" }},
        {id: 15, type: "emotion", attributes: { word: "Anxious", category: "negative" }},
        {id: 16, type: "emotion", attributes: { word: "Worried", category: "negative" }},
        {id: 17, type: "emotion", attributes: { word: "Angry", category: "negative" }},
        {id: 18, type: "emotion", attributes: { word: "Disappointed", category: "negative" }},
        {id: 19, type: "emotion", attributes: { word: "Exasperated", category: "negative" }},
        {id: 20, type: "emotion", attributes: { word: "Annoyed", category: "negative" }},
        {id: 21, type: "emotion", attributes: { word: "Bored", category: "negative" }},
        {id: 22, type: "emotion", attributes: { word: "Miserable", category: "negative" }},
        {id: 23, type: "emotion", attributes: { word: "Sad", category: "negative" }},
        {id: 24, type: "emotion", attributes: { word: "Tired", category: "negative" }},
      ],
      response: {
        attributes: {
          productivity_comment: "",
        },
      }
   }
    
    render(
      <MemoryRouter>
        <ListEmotions service={mockService} data={data} setData={() => {}} saveDataToDb={() => {}} steps={{}}/>
      </MemoryRouter>
    );
    expect(screen.getByText("Which word best describes how you’ve recently felt about work?")).toBeInTheDocument();
  });
});
