import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CheckInPage from './pages/CheckInPage';
import DashboardPage from './pages/DashboardPage';
import SetupPage from './pages/SetupPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/checkin/:clientId" element={<CheckInPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={<SetupPage />} />
    </Routes>
  </BrowserRouter>
);
