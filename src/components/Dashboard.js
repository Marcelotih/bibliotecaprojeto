import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
      navigate('/');
      return;
    }
    setUsuario(usuarioLogado);
    
    const todasReservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const minhasReservas = todasReservas.filter(r => r.cpf === usuarioLogado.cpf);
    setReservas(minhasReservas);
  }, [navigate]);

  const modalidades = {
    'técnico': 'Técnico',
    'graduação': 'Graduação',
    'básica': 'Educação Básica',
    'qualificação': 'Qualificação Profissional',
    'ejas': 'EJAS'
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  const handleCheckin = (reservaId) => {
    const agora = new Date();
    const todasReservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const reserva = todasReservas.find(r => r.id === reservaId);
    
    if (!reserva) return;

    const horaReserva = new Date(reserva.dataHora);
    const diffMinutos = (agora - horaReserva) / 1000 / 60;

    if (diffMinutos < -5) {
      alert('Check-in só pode ser feito 5 minutos antes do horário');
      return;
    }

    if (diffMinutos > 30) {
      alert('Tempo de check-in expirado (limite: 30 minutos)');
      return;
    }

    if (diffMinutos > 15) {
      if (!window.confirm('Você está atrasado. Deseja confirmar o check-in mesmo assim?')) {
        return;
      }
    }

    const reservasAtualizadas = todasReservas.map(r => 
      r.id === reservaId ? { ...r, status: 'em_uso', checkin: agora.toISOString() } : r
    );
    
    localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));
    window.location.reload();
  };

  const handleCheckout = (reservaId) => {
    const todasReservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const reservasAtualizadas = todasReservas.map(r => 
      r.id === reservaId ? { ...r, status: 'finalizada', checkout: new Date().toISOString() } : r
    );
    
    localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));
    window.location.reload();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sistema de Reservas</h1>
        <div className="usuario-info">
          <span>{usuario?.nome} - {modalidades[usuario?.modalidade]}</span>
          <button onClick={handleLogout} className="btn-sair">Sair</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="acoes-rapidas">
          <button onClick={() => navigate('/reserva-sala')} className="btn-acao">
            Reservar Sala
          </button>
          <button onClick={() => navigate('/reserva-computador')} className="btn-acao">
            Reservar Computador
          </button>
          <button onClick={() => navigate('/termos')} className="btn-acao">
            Termos de Uso
          </button>
        </div>

        <div className="info-modalidade">
          <h3>Sua Modalidade: {modalidades[usuario?.modalidade]}</h3>
          <div className="limites">
            <p>Tempo máximo por reserva: {usuario?.modalidade === 'básica' ? '1 hora' : '2 horas'}</p>
            <p>Limite de agendamentos: {usuario?.modalidade === 'técnico' ? '3 por dia' : '2 por dia'}</p>
          </div>
        </div>

        <div className="reservas-ativas">
          <h3>Suas Reservas</h3>
          {reservas.length === 0 ? (
            <p>Nenhuma reserva encontrada</p>
          ) : (
            <div className="lista-reservas">
              {reservas.map(reserva => (
                <div key={reserva.id} className={`reserva-card status-${reserva.status}`}>
                  <div className="reserva-info">
                    <h4>{reserva.tipo === 'sala' ? 'Sala' : 'Computador'}: {reserva.recurso}</h4>
                    <p>Data/Hora: {new Date(reserva.dataHora).toLocaleString('pt-BR')}</p>
                    <p>Duração: {reserva.duracao} minutos</p>
                    <p>Pessoas: {reserva.pessoas}</p>
                    <p>Status: {
                      reserva.status === 'pendente' ? 'Pendente' :
                      reserva.status === 'em_uso' ? 'Em uso' : 'Finalizada'
                    }</p>
                    {reserva.checkin && (
                      <p>Check-in: {new Date(reserva.checkin).toLocaleTimeString('pt-BR')}</p>
                    )}
                    {reserva.checkout && (
                      <p>Check-out: {new Date(reserva.checkout).toLocaleTimeString('pt-BR')}</p>
                    )}
                  </div>
                  
                  <div className="reserva-acoes">
                    {reserva.status === 'pendente' && (
                      <button onClick={() => handleCheckin(reserva.id)} className="btn-checkin">
                        Check-in
                      </button>
                    )}
                    {reserva.status === 'em_uso' && (
                      <button onClick={() => handleCheckout(reserva.id)} className="btn-checkout">
                        Check-out
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;