import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/common/Navigation';
import AIMentor from './components/AIMentor';
import RoadmapGenerator from './components/RoadmapGenerator';
import CounselingBooking from './components/CounselingBooking';
import SuccessStories from './components/SuccessStories';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<AIMentor />} />
            <Route path="/roadmap" element={<RoadmapGenerator />} />
            <Route path="/counseling" element={<CounselingBooking />} />
            <Route path="/success-stories" element={<SuccessStories />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 