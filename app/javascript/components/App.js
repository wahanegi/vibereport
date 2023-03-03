import React from "react"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Emotions from "./Emotions";
import ResponseFlow from "./ResponseFlow";

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<Emotions />} />
        <Route path="/responses/:id" element={<ResponseFlow />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;