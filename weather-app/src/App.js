import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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
              <Link to="/" className="nav-link">
                Weather
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/favorites" className="nav-link">
                Favorites
              </Link>
            </li>
          </ul>
        </div>

        <Routes>
          <Route path="/" element={<Weather />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/weather/:city" element={<Weather />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
