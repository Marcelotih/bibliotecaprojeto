import React from 'react';
import { Link } from 'react-router-dom';

function Home({ usuario }) {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-icon">🏛️</div>
        <h1>Sistema de Reservas</h1>
        <p>Reserve salas de estudo e computadores para uso acadêmico</p>
        
        {!usuario ? (
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Entrar</Link>
            <Link to="/cadastro" className="btn-secondary">Cadastrar-se</Link>
          </div>
        ) : (
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn-primary">Ir para Dashboard</Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">💻</div>
          <h3>Reserva de Computadores</h3>
          <p>Reserve computadores para estudo e pesquisa</p>
          <ul className="feature-details">
            <li>Máximo 2 pessoas por computador</li>
            <li>Check-in obrigatório</li>
            <li>Uso para fins acadêmicos</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🏛️</div>
          <h3>Reserva de Salas</h3>
          <p>Salas de estudo em grupo com até 5 pessoas</p>
          <ul className="feature-details">
            <li>Mínimo 1, máximo 5 pessoas</li>
            <li>Check-in até 5 minutos antes</li>
            <li>Tolerância de 15 minutos</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Dashboard</h3>
          <p>Acompanhe suas reservas em tempo real</p>
          <ul className="feature-details">
            <li>Visualize reservas ativas</li>
            <li>Faça check-in/check-out</li>
            <li>Histórico de uso</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚠️</div>
          <h3>Regras de Uso</h3>
          <p>Check-in 5 min antes até 30 min depois</p>
          <ul className="feature-details">
            <li>Limite de 2-3 reservas/dia</li>
            <li>Cancelamento com 24h</li>
            <li>Respeite o tempo de uso</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;