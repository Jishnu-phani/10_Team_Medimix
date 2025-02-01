import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './components/register';
import Logindone from './components/login';
import DoctorPage from './components/record';
import PatientProfile from './components/patient';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/login" element={<Logindone />} />
          <Route path="/record" element={<DoctorPage />} />
          <Route path="/patient" element={<PatientProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
