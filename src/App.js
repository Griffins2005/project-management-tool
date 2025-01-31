import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Project from "./pages/project";
import Teams from "./pages/team";
import "./index.css";
import Priority from "./pages/priority";
import ProgressTracking from "./pages/progressTracking";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Project />} />
            <Route path="/team" element={<Teams />} />
            <Route path="/progress" element={<ProgressTracking />} />
            <Route path="/priority" element={<Priority />} />
            <Route path="/team" element={<Teams />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;