import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Users from './pages/Users';
import Requests from './pages/Requests';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <LoginPage /> } />
        <Route path='dashboard' element = { <Dashboard /> } />
        <Route path='vehicles' element = { <Vehicles /> } />
        <Route path='users' element = { <Users /> } />
        <Route path='requests' element = { <Requests /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)