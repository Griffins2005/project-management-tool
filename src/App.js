import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
    <div className="App">
      {/* Only show Navbar and Footer for routes other than Login */}
      {location.pathname !== "/" && <Navbar />}
      <main>
        <Routes>
          {/* Login page without Navbar and Footer */}
          <Route path="/" element={<Login />} />
          <Route path="/project" element={<Project />} />
          <Route path="/team" element={<Teams />} />
          <Route path="/progress" element={<ProgressTracking />} />
          <Route path="/priority" element={<Priority />} />
        </Routes>
      </main>
      {/* Only show Footer for routes other than Login */}
      {location.pathname !== "/" && <Footer />}
    </div>
  );
}

export default App;
