import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Dashboard from './components/Dashboard';
import ReservaSala from './components/ReservaSala';
import ReservaComputador from './components/ReservaComputador';
import TermosUso from './components/TermosUso';
import AdminCadastros from './components/AdminCadastros';
import Home from './components/Home';
import { recuperarSessao, logout } from './services/authService';
import './App.css';

// Componente para rotas protegidas
const RotaProtegida = ({ children, tipoPermitido = null }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessao = recuperarSessao();
    setUsuario(sessao);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Verificar se o tipo de usuário é permitido
  if (tipoPermitido && usuario.tipo !== tipoPermitido) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const sessao = recuperarSessao();
    if (sessao) {
      setUsuario(sessao);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUsuario(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="App">
        {/* Header condicional para mostrar menu quando logado */}
        {usuario && (
          <header className="app-header">
            <div className="header-content">
              <div className="logo">
                <span>📚</span>
                <h2>Biblioteca</h2>
              </div>
              <div className="user-info">
                <span>Olá, {usuario.nome}</span>
                <button onClick={handleLogout} className="logout-btn">Sair</button>
              </div>
            </div>
          </header>
        )}

        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home usuario={usuario} />} />
          <Route path="/login" element={<Login onLoginSuccess={setUsuario} />} />
          <Route path="/termos" element={<TermosUso />} />
          
          {/* Rotas protegidas (usuário comum) */}
          <Route path="/dashboard" element={
            <RotaProtegida>
              <Dashboard usuario={usuario} />
            </RotaProtegida>
          } />
          <Route path="/cadastro" element={
            <RotaProtegida>
              <Cadastro usuario={usuario} />
            </RotaProtegida>
          } />
          <Route path="/reserva-sala" element={
            <RotaProtegida>
              <ReservaSala usuario={usuario} />
            </RotaProtegida>
          } />
          <Route path="/reserva-computador" element={
            <RotaProtegida>
              <ReservaComputador usuario={usuario} />
            </RotaProtegida>
          } />
          
          {/* Rotas administrativas */}
          <Route path="/admin/cadastros" element={
            <RotaProtegida tipoPermitido="admin">
              <AdminCadastros usuario={usuario} />
            </RotaProtegida>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;