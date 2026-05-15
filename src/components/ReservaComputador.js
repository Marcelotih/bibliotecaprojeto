import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';

const ReservaComputador = () => {
  const [usuario, setUsuario] = useState(null);
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [hora, setHora] = useState('');
  const [computador, setComputador] = useState('');
  const [pessoas, setPessoas] = useState(1);
  const [duracao, setDuracao] = useState(30);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const computadores = [
    'PC-01', 'PC-02', 'PC-03', 'PC-04', 'PC-05',
    'PC-06', 'PC-07', 'PC-08', 'PC-09', 'PC-10'
  ];

  const horarios = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
      navigate('/');
      return;
    }
    setUsuario(usuarioLogado);
  }, [navigate]);

  const verificarDisponibilidade = (pc, dataHora, duracao) => {
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const inicio = new Date(dataHora);
    const fim = new Date(inicio.getTime() + duracao * 60000);

    return !reservas.some(reserva => {
      if (reserva.recurso !== pc || reserva.status === 'cancelada') return false;
      const reservaInicio = new Date(reserva.dataHora);
      const reservaFim = new Date(reservaInicio.getTime() + reserva.duracao * 60000);
      
      return (inicio < reservaFim && fim > reservaInicio);
    });
  };

  const verificarLimiteAgendamentos = () => {
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const hoje = new Date().toDateString();
    const maxReservas = usuario?.modalidade === 'técnico' ? 3 : 2;
    
    const reservasHoje = reservas.filter(r => 
      r.cpf === usuario?.cpf && 
      new Date(r.dataHora).toDateString() === hoje &&
      r.status !== 'cancelada'
    );

    return reservasHoje.length < maxReservas;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (!verificarLimiteAgendamentos()) {
      setErro('Limite de agendamentos diários atingido');
      return;
    }

    if (pessoas < 1 || pessoas > 2) {
      setErro('Máximo de 2 pessoas por computador');
      return;
    }

    const dataHora = `${data}T${hora}:00`;
    
    if (!verificarDisponibilidade(computador, dataHora, duracao)) {
      setErro('Horário não disponível para este computador');
      return;
    }

    const novaReserva = {
      id: Date.now().toString(),
      cpf: usuario.cpf,
      tipo: 'computador',
      recurso: computador,
      dataHora,
      duracao,
      pessoas,
      status: 'pendente',
      dataCriacao: new Date().toISOString()
    };

    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push(novaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    alert('Reserva de computador realizada com sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="reserva-container">
      <header className="reserva-header">
        <h2>Reserva de Computador</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-voltar">Voltar</button>
      </header>

      <div className="regras-reserva">
        <h4>Regras para Uso de Computadores:</h4>
        <ul>
          <li>Máximo 2 pessoas por computador</li>
          <li>Check-in obrigatório</li>
          <li>Uso para fins acadêmicos</li>
          <li>Não é permitido instalar softwares</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="reserva-form">
        <div className="form-group">
          <label>Data:</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            max={format(addDays(new Date(), 7), 'yyyy-MM-dd')}
            required
          />
        </div>

        <div className="form-group">
          <label>Horário:</label>
          <select value={hora} onChange={(e) => setHora(e.target.value)} required>
            <option value="">Selecione o horário</option>
            {horarios.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Computador:</label>
          <select value={computador} onChange={(e) => setComputador(e.target.value)} required>
            <option value="">Selecione o computador</option>
            {computadores.map(pc => (
              <option key={pc} value={pc}>{pc}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Número de Pessoas:</label>
          <input
            type="number"
            value={pessoas}
            onChange={(e) => setPessoas(parseInt(e.target.value))}
            min="1"
            max="2"
            required
          />
        </div>

        <div className="form-group">
          <label>Duração (minutos):</label>
          <select value={duracao} onChange={(e) => setDuracao(parseInt(e.target.value))} required>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="90">1 hora e 30 minutos</option>
            <option value="120">2 horas</option>
          </select>
        </div>

        {erro && <div className="erro-mensagem">{erro}</div>}

        <button type="submit" className="btn-reservar">Reservar Computador</button>
      </form>
    </div>
  );
};

export default ReservaComputador;