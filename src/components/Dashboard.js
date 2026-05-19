import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recuperarSessao, logout, getReservasUsuario, atualizarReserva } from '../services/authService';
import CheckInOut from './CheckInOut';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = recuperarSessao();
    if (!usuarioLogado) {
      navigate('/login');
      return;
    }
    setUsuario(usuarioLogado);
    carregarReservas(usuarioLogado.cpf);
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(() => carregarReservas(usuarioLogado.cpf), 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const carregarReservas = (cpf) => {
    const minhasReservas = getReservasUsuario(cpf);
    minhasReservas.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
    setReservas(minhasReservas);
  };

  const modalidades = {
    'técnico': 'Técnico',
    'graduação': 'Graduação',
    'básica': 'Educação Básica',
    'qualificação': 'Qualificação Profissional',
    'ejas': 'EJAS'
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCheckinClick = (reserva) => {
    if (reserva.status !== 'aprovada') {
      alert('⏳ Esta reserva ainda não foi aprovada pelo administrador.');
      return;
    }
    setReservaSelecionada(reserva);
    setMostrarModal(true);
  };

  const handleConfirmarCheckinOut = async (reservaAtualizada) => {
    await atualizarReserva(reservaAtualizada.id, reservaAtualizada);
    carregarReservas(usuario.cpf);
    setMostrarModal(false);
    setReservaSelecionada(null);
    
    const mensagem = reservaAtualizada.status === 'em_uso' 
      ? '✅ Check-in realizado com sucesso!' 
      : '✅ Check-out realizado com sucesso!';
    alert(mensagem);
  };

  const getStatusText = (reserva) => {
    switch(reserva.status) {
      case 'aguardando_aprovacao': return '⏳ Aguardando Aprovação';
      case 'aprovada': return '✅ Aprovada';
      case 'em_uso': return '🟢 Em uso';
      case 'finalizada': return '✅ Finalizada';
      case 'reprovada': return '❌ Reprovada';
      case 'cancelada': return '❌ Cancelada';
      default: return reserva.status;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'aguardando_aprovacao': return 'status-aguardando';
      case 'aprovada': return 'status-aprovada';
      case 'em_uso': return 'status-ativo';
      case 'finalizada': return 'status-finalizada';
      case 'reprovada': return 'status-reprovada';
      default: return '';
    }
  };

  const podeFazerCheckin = (reserva) => {
    if (reserva.status !== 'aprovada') return false;
    
    const agora = new Date();
    const horaReserva = new Date(reserva.dataHora);
    const diffMinutos = (agora - horaReserva) / 1000 / 60;
    
    return diffMinutos >= -5 && diffMinutos <= 30;
  };

  const getTempoRestante = (reserva) => {
    if (reserva.status !== 'aprovada') return null;
    
    const agora = new Date();
    const horaReserva = new Date(reserva.dataHora);
    const diffMinutos = (agora - horaReserva) / 1000 / 60;
    
    if (diffMinutos < -5) {
      const minutosFaltando = Math.abs(Math.ceil(diffMinutos));
      return `⏰ Inicia em ${minutosFaltando} min`;
    } else if (diffMinutos <= 0) {
      return `✅ Check-in liberado!`;
    } else if (diffMinutos <= 15) {
      return `🟢 Check-in disponível`;
    } else if (diffMinutos <= 30) {
      return `⚠️ Atrasado - ${Math.floor(diffMinutos)} min`;
    } else {
      return `❌ Expirada`;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🏛️ Sistema de Reservas</h1>
          <p className="subtitle">Salas e Computadores</p>
        </div>
        <div className="usuario-info">
          <div className="usuario-detalhes">
            <span className="usuario-nome">{usuario?.nome}</span>
            <span className="usuario-modalidade">{modalidades[usuario?.modalidade]}</span>
          </div>
          <button onClick={handleLogout} className="btn-sair">Sair</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="acoes-rapidas">
          <button onClick={() => navigate('/reserva-sala')} className="btn-acao">
            🏛️ Reservar Sala
          </button>
          <button onClick={() => navigate('/reserva-computador')} className="btn-acao">
            💻 Reservar Computador
          </button>
          <button onClick={() => navigate('/termos')} className="btn-acao">
            📜 Termos de Uso
          </button>
          {usuario?.tipo === 'admin' && (
            <button onClick={() => navigate('/admin/cadastros')} className="btn-acao admin">
              👑 Admin - Gerenciar
            </button>
          )}
        </div>

        <div className="info-modalidade">
          <h3>Sua Modalidade: {modalidades[usuario?.modalidade]}</h3>
          <div className="limites">
            <p>⏱️ Tempo máximo por reserva: {usuario?.modalidade === 'básica' ? '1 hora' : '2 horas'}</p>
            <p>📅 Limite de agendamentos: {usuario?.modalidade === 'técnico' ? '3 por dia' : '2 por dia'}</p>
            <p>⚠️ Reservas acima de 4 horas precisam de aprovação administrativa</p>
          </div>
        </div>

        <div className="reservas-ativas">
          <h3>Minhas Reservas</h3>
          {reservas.length === 0 ? (
            <div className="sem-reservas">
              <p>📭 Nenhuma reserva encontrada</p>
              <button onClick={() => navigate('/reserva-sala')} className="btn-reservar-agora">
                Fazer primeira reserva
              </button>
            </div>
          ) : (
            <div className="lista-reservas">
              {reservas.map(reserva => (
                <div key={reserva.id} className={`reserva-card ${getStatusClass(reserva.status)}`}>
                  <div className="reserva-header-card">
                    <h4>
                      {reserva.tipo === 'sala' ? '🏛️ Sala' : '💻 Computador'}: {reserva.recurso}
                    </h4>
                    <span className={`status-badge ${reserva.status}`}>
                      {getStatusText(reserva)}
                    </span>
                  </div>
                  
                  <div className="reserva-info">
                    <p><strong>📅 Data/Hora:</strong> {new Date(reserva.dataHora).toLocaleString('pt-BR')}</p>
                    <p><strong>⏱️ Duração:</strong> {reserva.duracao} minutos ({Math.floor(reserva.duracao/60)}h{reserva.duracao%60}min)</p>
                    <p><strong>👥 Pessoas:</strong> {reserva.pessoas}</p>
                    
                    {reserva.precisaAprovacao && reserva.status === 'aguardando_aprovacao' && (
                      <p className="aviso-aprovacao">⏳ Reserva longa aguardando aprovação do administrador</p>
                    )}
                    
                    {reserva.status === 'reprovada' && reserva.motivoReprovacao && (
                      <p className="motivo-reprovacao">❌ Motivo: {reserva.motivoReprovacao}</p>
                    )}
                    
                    {reserva.status === 'aprovada' && (
                      <p className={`tempo-restante ${new Date(reserva.dataHora) < new Date() ? 'atrasado' : ''}`}>
                        {getTempoRestante(reserva)}
                      </p>
                    )}
                    
                    {reserva.checkin && (
                      <p><strong>✅ Check-in:</strong> {new Date(reserva.checkin).toLocaleTimeString('pt-BR')}</p>
                    )}
                    {reserva.checkout && (
                      <p><strong>🏁 Check-out:</strong> {new Date(reserva.checkout).toLocaleTimeString('pt-BR')}</p>
                    )}
                    {reserva.tempoUso && (
                      <p><strong>⏱️ Tempo de uso:</strong> {reserva.tempoUso} minutos</p>
                    )}
                  </div>
                  
                  <div className="reserva-acoes">
                    {reserva.status === 'aprovada' && (
                      <button 
                        onClick={() => handleCheckinClick(reserva)}
                        className={`btn-checkin ${!podeFazerCheckin(reserva) ? 'disabled' : ''}`}
                        disabled={!podeFazerCheckin(reserva)}
                      >
                        {new Date(reserva.dataHora) > new Date() ? '⏰ Aguardando horário' : 
                         new Date(reserva.dataHora) <= new Date() && new Date(reserva.dataHora) > new Date(Date.now() - 30*60000) ? '✅ Fazer Check-in' :
                         '⌛ Check-in indisponível'}
                      </button>
                    )}
                    {reserva.status === 'em_uso' && (
                      <button onClick={() => handleCheckinClick(reserva)} className="btn-checkout">
                        🏁 Finalizar Uso
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {mostrarModal && reservaSelecionada && (
        <CheckInOut
          reserva={reservaSelecionada}
          onClose={() => {
            setMostrarModal(false);
            setReservaSelecionada(null);
          }}
          onConfirm={handleConfirmarCheckinOut}
        />
      )}
    </div>
  );
};

export default Dashboard;