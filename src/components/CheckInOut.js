import React, { useState, useEffect } from 'react';

const CheckInOut = ({ reserva, onClose, onConfirm }) => {
  const [diffMinutos, setDiffMinutos] = useState(0);

  useEffect(() => {
    const calcularTempo = () => {
      const agora = new Date();
      const horaReserva = new Date(reserva.dataHora);
      const diff = (agora - horaReserva) / 1000 / 60;
      setDiffMinutos(diff);
    };

    calcularTempo();
    const interval = setInterval(calcularTempo, 1000);
    return () => clearInterval(interval);
  }, [reserva]);

  const podeCheckin = () => {
    if (reserva.status !== 'pendente') return false;
    // Pode fazer checkin 5 minutos antes até 30 minutos depois
    return diffMinutos >= -5 && diffMinutos <= 30;
  };

  const handleCheckin = () => {
    const agora = new Date();
    const atraso = diffMinutos > 15;
    
    if (diffMinutos > 15 && diffMinutos <= 30) {
      if (!window.confirm(`⚠️ Você está com ${Math.floor(diffMinutos)} minutos de atraso. Deseja confirmar o check-in mesmo assim?`)) {
        return;
      }
    }
    
    if (diffMinutos > 30) {
      alert('❌ Tempo de check-in expirado! A reserva não pode mais ser ativada.');
      onClose();
      return;
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
    const checkinTime = new Date(reserva.checkin);
    const duracaoUso = Math.floor((agora - checkinTime) / 1000 / 60);
    
    if (!window.confirm(`✅ Confirmar check-out?\n\nTempo de uso: ${duracaoUso} minutos\n\nDeseja finalizar o uso do recurso?`)) {
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

  const getStatusMessage = () => {
    if (reserva.status === 'pendente') {
      if (diffMinutos < -5) {
        return `⏰ Check-in disponível em ${Math.abs(Math.ceil(diffMinutos))} minutos`;
      } else if (diffMinutos <= 0) {
        return '✅ Check-in liberado agora!';
      } else if (diffMinutos <= 15) {
        return `✅ Check-in disponível (${Math.floor(diffMinutos)} min de atraso)`;
      } else if (diffMinutos <= 30) {
        return `⚠️ ATENÇÃO: ${Math.floor(diffMinutos)} minutos de atraso! Última chance.`;
      } else {
        return '❌ Tempo de check-in expirado';
      }
    }
    return null;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkinout-modal" onClick={e => e.stopPropagation()}>
        <h3>
          {reserva.status === 'pendente' ? '✅ Check-in' : '🏁 Check-out'} - 
          {reserva.tipo === 'sala' ? ' Sala' : ' Computador'}
        </h3>
        
        <div className="reserva-info-modal">
          <div className="info-row">
            <strong>Recurso:</strong> {reserva.recurso}
          </div>
          <div className="info-row">
            <strong>Data/Hora:</strong> {new Date(reserva.dataHora).toLocaleString('pt-BR')}
          </div>
          <div className="info-row">
            <strong>Duração:</strong> {reserva.duracao} minutos
          </div>
          <div className="info-row">
            <strong>Pessoas:</strong> {reserva.pessoas}
          </div>
        </div>

        {reserva.status === 'pendente' && (
          <div className={`timer-display ${diffMinutos > 15 ? 'timer-warning' : ''}`}>
            {getStatusMessage()}
          </div>
        )}

        {reserva.status === 'em_uso' && (
          <div className="timer-display info">
            🟢 Em uso desde: {new Date(reserva.checkin).toLocaleTimeString('pt-BR')}
          </div>
        )}

        <div className="modal-buttons">
          {reserva.status === 'pendente' && (
            <button
              onClick={handleCheckin}
              disabled={!podeCheckin() || diffMinutos > 30}
              className={`btn-checkin-modal ${(!podeCheckin() || diffMinutos > 30) ? 'disabled' : ''}`}
            >
              {diffMinutos > 30 ? 'Reserva Expirada' : 'Confirmar Check-in'}
            </button>
          )}

          {reserva.status === 'em_uso' && (
            <button onClick={handleCheckout} className="btn-checkout-modal">
              Finalizar Check-out
            </button>
          )}

          <button onClick={onClose} className="btn-cancelar-modal">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;