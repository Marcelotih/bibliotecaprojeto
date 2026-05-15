import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Dashboard from './components/Dashboard';
import ReservaSala from './components/ReservaSala';
import ReservaComputador from './components/ReservaComputador';
import TermosUso from './components/TermosUso';
import AdminCadastros from './components/AdminCadastros';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reserva-sala" element={<ReservaSala />} />
          <Route path="/reserva-computador" element={<ReservaComputador />} />
          <Route path="/termos" element={<TermosUso />} />
          <Route path="/admin/cadastros" element={<AdminCadastros />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;