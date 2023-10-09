import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.scss';
import Home from './Pages/Home/Home';

function App() {
  return (
    <div className="App">
      <header>
        <h1>LittleBill</h1>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
