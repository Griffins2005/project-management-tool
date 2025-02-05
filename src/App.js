import React from "react";
import { useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Project from "./pages/project";
import Teams from "./pages/team";
import "./index.css";
import Priority from "./pages/priority";
import ProgressTracking from "./pages/progressTracking";
import Login from "./pages/loginSignup";

function App() {
  const location = useLocation();

  return (
    <Router>
      <div className="App">
        {/* Hide Navbar and Footer on Login Page */}
        {location.pathname !== "/" && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/project" element={<Project />} />
            <Route path="/team" element={<Teams />} />
            <Route path="/progress" element={<ProgressTracking />} />
            <Route path="/priority" element={<Priority />} />
          </Routes>
        </main>
        {location.pathname !== "/" && <Footer />}
      </div>
    </Router>
  );
}

export default App;
