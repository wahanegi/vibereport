import React from "react"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import EmotionSelectionPage from "./Pages/EmotionSelectionPage";
import ListEmotions from "./Pages/ListEmotions";
import ResponseFlow from "./ResponseFlow";
import EmotionEntry from "./Pages/EmotionEntry";
import Results from "./Pages/Results";

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        {/*<Route path="/app" element={<EmotionSelectionPage />} />*/}
        <Route path="/app" element={<ListEmotions />} />
        <Route path="/responses/:id" element={<ResponseFlow />} />
        <Route path="app/emotion_entry" element={<EmotionEntry />} />
        <Route path="/app/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;