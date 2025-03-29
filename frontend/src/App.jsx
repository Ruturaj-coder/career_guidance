import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AIMentor from './components/AIMentor';
import RoadmapGenerator from './components/RoadmapGenerator';
import CounselingBooking from './components/CounselingBooking';
import SuccessStories from './components/SuccessStories';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/mentor">AI Mentor</Link></li>
            <li><Link to="/roadmap">Roadmap Generator</Link></li>
            <li><Link to="/counseling">Book Counseling</Link></li>
            <li><Link to="/success-stories">Success Stories</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/mentor" element={<AIMentor />} />
          <Route path="/roadmap" element={<RoadmapGenerator />} />
          <Route path="/counseling" element={<CounselingBooking />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/" element={<AIMentor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 