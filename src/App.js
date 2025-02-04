import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Project from "./pages/project";
import Teams from "./pages/team";
import "./index.css";
import Priority from "./pages/priority";
import ProgressTracking from "./pages/progressTracking";
import Login from "./pages/loginSignup";

function App() {
  return (
    <div className="App">
      {/* Only show Navbar and Footer for routes other than Login */}
      {window.location.pathname !== "/" && <Navbar />}
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
      {window.location.pathname !== "/" && <Footer />}
    </div>
  );
}

export default App;