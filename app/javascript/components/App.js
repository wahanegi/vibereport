import React from "react"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
// <<<<<<< HEAD
import EmotionSelectionPage from "./Pages/EmotionSelectionPage";
// =======
import ListEmotions from "./Pages/ListEmotions";
// >>>>>>> 59735de (CI-40: Create page ListEmotions.jsx, UI elements etc)
import ResponseFlow from "./ResponseFlow";
import EmotionEntry from "./Pages/EmotionEntry";
import Results from "./Pages/Results";

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
{/*<<<<<<< HEAD*/}
{/*        <Route path="/app" element={<EmotionSelectionPage />} />*/}
{/*=======*/}
        <Route path="/app" element={<ListEmotions />} />
{/*>>>>>>> 59735de (CI-40: Create page ListEmotions.jsx, UI elements etc)*/}
        <Route path="/responses/:id" element={<ResponseFlow />} />
        <Route path="/emotion_entry" element={<EmotionEntry />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;