import {render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import React from "react";
import MemeSelection from "../Pages/MemeSelection";

describe('MemeSelection component',  () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
    })
  );

  beforeEach(() => {
    fetch.mockClear();
  });

  it('should render ListEmotions component when the path is "/meme-selection"', async () => {
    const mockService = { isLoading: false, error: null };
    const data = {
      emotion: {
        category: "negative",
        word: "anxious"
      },
      api_giphy_key: 'api_key',
      response: {
        attributes: {
          gif_url: 'https://media.giphy.com/media/Ec8IY1BRRH3vrZfbcf/giphy.gif',
          steps: ["emotion-selection-web","meme-selection"]
        }
      }
    }

    render(
      <MemoryRouter>
        <MemeSelection service={mockService} data={data} setData={() => {}} saveDataToDb={() => {}} steps={{}} setIsCustomGif={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "//api.giphy.com/v1/gifs/search?q=anxious&api_key=api_key"
      );
    });
  });
});

