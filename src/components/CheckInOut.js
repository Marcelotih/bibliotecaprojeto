import React, { useState, useEffect } from 'react';

const CheckInOut = ({ reserva, onClose, onConfirm }) => {
  const [timer, setTimer] = useState(0);
  const [podeCheckin, setPodeCheckin] = useState(false);
  const [tempoRestante, setTempoRestante] = useState('');
  const [contagemRegressiva, setContagemRegressiva] = useState(null);

  useEffect(() => {
    if (reserva) {
      verificarTempo();
      const interval = setInterval(verificarTempo, 1000);
      return () => clearInterval(interval);
    }
  }, [reserva]);

  const verificarTempo = () => {
    const agora = new Date();
    const horaReserva = new Date(reserva.dataHora);
    const diffMinutos = (agora - horaReserva) / 1000 / 60;

    // Para check-in
    if (reserva.status === 'pendente') {
      if (diffMinutos >= -5) {
        setPodeCheckin(true);
      }
      
      if (diffMinutos > 15) {
        setTimer(30 - diffMinutos);
        if (diffMinutos >= 30) {
          setPodeCheckin(false);
          setTempoRestante('EXPIRADO');
        }
      }
    }
  };

  const formatarTempo = (minutos) => {
    if (minutos <= 0) return '00:00';
    const mins = Math.floor(minutos);
    const segs = Math.floor((minutos - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const handleCheckin = () => {
    const agora = new Date();
    const horaReserva = new Date(reserva.dataHora);
    const diffMinutos = (agora - horaReserva) / 1000 / 60;

    if (diffMinutos > 15) {
      if (!window.confirm('Você está atrasado mais de 15 minutos. Deseja confirmar o check-in?')) {
        return;
      }
    }

    onConfirm({
      ...reserva,
      status: 'em_uso',
      checkin: agora.toISOString(),
      atraso: diffMinutos > 15
    });
  };

  const handleCheckout = () => {
    const agora = new Date();
    const duracaoUso = ((agora - new Date(reserva.checkin)) / 1000 / 60).toFixed(0);

    if (!window.confirm(`Confirmar check-out? Tempo de uso: ${duracaoUso} minutos`)) {
      return;
    }

    onConfirm({
      ...reserva,
      status: 'finalizada',
      checkout: agora.toISOString(),
      tempoUso: duracaoUso
    });
  };

  if (!reserva) return null;

  const agora = new Date();
  const horaReserva = new Date(reserva.dataHora);
  const diffMinutos = (agora - horaReserva) / 1000 / 60;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>
          {reserva.status === 'pendente' ? 'Check-in' : 'Check-out'} - 
          {reserva.tipo === 'sala' ? ' Sala' : ' Computador'}
        </h3>
        
        <div className="reserva-info">
          <p><strong>Recurso:</strong> {reserva.recurso}</p>
          <p><strong>Data/Hora:</strong> {new Date(reserva.dataHora).toLocaleString('pt-BR')}</p>
          <p><strong>Duração:</strong> {reserva.duracao} minutos</p>
          <p><strong>Pessoas:</strong> {reserva.pessoas}</p>
          
          {reserva.status === 'pendente' && (
            <div className="status-badge">
              {diffMinutos < -5 ? 'Muito cedo' : 
               diffMinutos <= 0 ? 'Disponível em breve' :
               diffMinutos <= 15 ? 'Hora do check-in' :
               diffMinutos <= 30 ? 'ATRASADO' : 'EXPIRADO'}
            </div>
          )}
          
          {reserva.status === 'em_uso' && (
            <div className="status-badge em_uso">EM USO</div>
          )}
        </div>

        {reserva.status === 'pendente' && (
          <>
            <div className={`timer-display ${diffMinutos > 15 ? 'timer-warning' : ''}`}>
              {diffMinutos < -5 ? `Faltam ${Math.abs(Math.ceil(diffMinutos))} min` :
               diffMinutos <= 0 ? 'Liberado!' :
               diffMinutos <= 15 ? 'Hora do check-in' :
               diffMinutos < 30 ? `ATRASO: ${Math.floor(diffMinutos)} min` :
               'EXPIRADO'}
            </div>
            
            <button
              onClick={handleCheckin}
              disabled={!podeCheckin || diffMinutos >= 30}
              className={`btn-checkin ${(!podeCheckin || diffMinutos >= 30) ? 'disabled' : ''}`}
            >
              {diffMinutos >= 30 ? 'Reserva Expirada' : 'Confirmar Check-in'}
            </button>
          </>
        )}

        {reserva.status === 'em_uso' && (
          <>
            <div className="timer-display">
              Em uso desde: {new Date(reserva.checkin).toLocaleTimeString('pt-BR')}
            </div>
            
            <button onClick={handleCheckout} className="btn-checkout">
              Realizar Check-out
            </button>
          </>
        )}

        <button onClick={onClose} className="btn-voltar" style={{ marginTop: '15px' }}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CheckInOut;