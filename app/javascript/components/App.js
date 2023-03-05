import React from "react"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import EmotionSelectionPage from "./Pages/EmotionSelectionPage";
import ResponseFlow from "./ResponseFlow";
import EmotionEntry from "./Pages/EmotionEntry";
import Results from "./Pages/Results";

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<EmotionSelectionPage />} />
        <Route path="/responses/:id" element={<ResponseFlow />} />
        <Route path="/emotion_entry" element={<EmotionEntry />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;