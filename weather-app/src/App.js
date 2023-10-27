import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Weather from "./components/Weather";
import Favorites from "./components/Favorites";
import "./style/app.style.scss";

function App() {
  return (
    <div className="main_container">
      <Router>
        <div className="container mt-3">
          <ul className="nav">
            <li className="nav-item">
              <a href="/" className="nav-link">
                Weather
              </a>
            </li>
            <li className="nav-item">
              <a href="/favorites" className="nav-link">
                Favorites
              </a>
            </li>
          </ul>
        </div>

        <Routes>
          <Route path="/" element={<Weather />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
