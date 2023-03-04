import React from "react"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import EmotionSelectionPage from "./EmotionSelectionPage";
import ResponseFlow from "./ResponseFlow";

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<EmotionSelectionPage />} />
        <Route path="/responses/:id" element={<ResponseFlow />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;