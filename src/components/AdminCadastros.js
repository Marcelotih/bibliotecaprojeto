import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservasDoDia, getAllReservas, aprovarReserva, reprovarReserva, recuperarSessao } from '../services/authService';

const AdminCadastros = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [reservasDia, setReservasDia] = useState([]);
  const [reservasPendentes, setReservasPendentes] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('reservas');
  const [filtro, setFiltro] = useState('todos');
  const [motivoReprovacao, setMotivoReprovacao] = useState('');
  const [showModal, setShowModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = recuperarSessao();
    if (!usuario || usuario.tipo !== 'admin') {
      navigate('/dashboard');
      return;
    }
    carregarDados();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarDados, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const carregarDados = () => {
    carregarUsuarios();
    carregarReservasDia();
    carregarReservasPendentes();
  };

  const carregarUsuarios = () => {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios') || '[]');
    setUsuarios(usuariosSalvos);
  };

  const carregarReservasDia = () => {
    const reservas = getReservasDoDia();
    setReservasDia(reservas);
  };

  const carregarReservasPendentes = () => {
    const todasReservas = getAllReservas();
    const pendentes = todasReservas.filter(r => r.status === 'aguardando_aprovacao');
    setReservasPendentes(pendentes);
  };

  const handleAprovar = (reservaId) => {
    if (aprovarReserva(reservaId)) {
      alert('✅ Reserva aprovada com sucesso!');
      carregarDados();
      setShowModal(null);
    }
  };

  const handleReprovar = (reservaId) => {
    if (!motivoReprovacao.trim()) {
      alert('⚠️ Por favor, informe o motivo da reprovação.');
      return;
    }
    
    if (reprovarReserva(reservaId, motivoReprovacao)) {
      alert('❌ Reserva reprovada.');
      carregarDados();
      setShowModal(null);
      setMotivoReprovacao('');
    }
  };

  const usuariosFiltrados = filtro === 'todos' 
    ? usuarios 
    : usuarios.filter(u => u.modalidade === filtro);

  const modalidades = ['todos', 'técnico', 'graduação', 'básica', 'qualificação', 'ejas'];

  const getStatusReserva = (reserva) => {
    const agora = new Date();
    const horaReserva = new Date(reserva.dataHora);
    const diffMinutos = (agora - horaReserva) / 1000 / 60;
    
    if (reserva.status === 'aguardando_aprovacao') return { text: '⏳ Aguardando Aprovação', class: 'aguardando' };
    if (reserva.status === 'aprovada') {
      if (diffMinutos < 0) return { text: '✅ Aprovada - Aguardando', class: 'aprovada' };
      if (diffMinutos <= 30) return { text: '🟢 Em andamento', class: 'andamento' };
      return { text: '⏰ Expirada', class: 'expirada' };
    }
    if (reserva.status === 'em_uso') return { text: '🟢 Em uso', class: 'em_uso' };
    if (reserva.status === 'finalizada') return { text: '✅ Finalizada', class: 'finalizada' };
    if (reserva.status === 'reprovada') return { text: '❌ Reprovada', class: 'reprovada' };
    return { text: reserva.status, class: '' };
  };

  return (
    <div className="admin-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>👑 Painel Administrativo</h1>
          <p className="subtitle">Gerenciamento de Reservas e Usuários</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-voltar">
          Voltar ao Dashboard
        </button>
      </header>

      <div className="admin-content">
        {/* Abas */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${abaAtiva === 'reservas' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('reservas')}
          >
            📅 Reservas do Dia
          </button>
          <button 
            className={`tab-btn ${abaAtiva === 'pendentes' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('pendentes')}
          >
            ⏳ Aprovações Pendentes {reservasPendentes.length > 0 && `(${reservasPendentes.length})`}
          </button>
          <button 
            className={`tab-btn ${abaAtiva === 'usuarios' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('usuarios')}
          >
            👥 Usuários Cadastrados
          </button>
        </div>

        {/* Aba de Reservas do Dia */}
        {abaAtiva === 'reservas' && (
          <div className="tabela-reservas">
            <h3>📅 Reservas do Dia - {new Date().toLocaleDateString('pt-BR')}</h3>
            <p className="total-reservas">Total: {reservasDia.length} reservas</p>
            
            {reservasDia.length === 0 ? (
              <div className="sem-reservas">
                <p>📭 Nenhuma reserva para hoje</p>
              </div>
            ) : (
              <div className="lista-reservas-admin">
                {reservasDia.map(reserva => {
                  const status = getStatusReserva(reserva);
                  return (
                    <div key={reserva.id} className={`reserva-admin-card ${status.class}`}>
                      <div className="reserva-header">
                        <h4>{reserva.tipo === 'sala' ? '🏛️ Sala' : '💻 Computador'}: {reserva.recurso}</h4>
                        <span className={`status-badge-admin ${status.class}`}>{status.text}</span>
                      </div>
                      <div className="reserva-detalhes">
                        <p><strong>👤 Usuário:</strong> {reserva.usuarioNome || reserva.cpf}</p>
                        <p><strong>⏰ Horário:</strong> {new Date(reserva.dataHora).toLocaleString('pt-BR')}</p>
                        <p><strong>⏱️ Duração:</strong> {reserva.duracao} minutos ({Math.floor(reserva.duracao/60)}h{reserva.duracao%60}min)</p>
                        <p><strong>👥 Pessoas:</strong> {reserva.pessoas}</p>
                        {reserva.precisaAprovacao && (
                          <p className="aprovacao-necessaria"><strong>⚠️</strong> Reserva longa (+4h)</p>
                        )}
                        {reserva.checkin && (
                          <p><strong>✅ Check-in:</strong> {new Date(reserva.checkin).toLocaleTimeString('pt-BR')}</p>
                        )}
                        {reserva.checkout && (
                          <p><strong>🏁 Check-out:</strong> {new Date(reserva.checkout).toLocaleTimeString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Aba de Aprovações Pendentes */}
        {abaAtiva === 'pendentes' && (
          <div className="tabela-reservas">
            <h3>⏳ Reservas Aguardando Aprovação</h3>
            <p className="total-reservas">Total: {reservasPendentes.length} reservas</p>
            
            {reservasPendentes.length === 0 ? (
              <div className="sem-reservas">
                <p>✅ Nenhuma reserva pendente de aprovação</p>
              </div>
            ) : (
              <div className="lista-reservas-admin">
                {reservasPendentes.map(reserva => (
                  <div key={reserva.id} className="reserva-admin-card pendente">
                    <div className="reserva-header">
                      <h4>{reserva.tipo === 'sala' ? '🏛️ Sala' : '💻 Computador'}: {reserva.recurso}</h4>
                      <span className="status-badge-admin aguardando">⏳ Aguardando</span>
                    </div>
                    <div className="reserva-detalhes">
                      <p><strong>👤 Usuário:</strong> {reserva.usuarioNome || reserva.cpf}</p>
                      <p><strong>📅 Data/Hora:</strong> {new Date(reserva.dataHora).toLocaleString('pt-BR')}</p>
                      <p><strong>⏱️ Duração:</strong> {reserva.duracao} minutos ({Math.floor(reserva.duracao/60)}h{reserva.duracao%60}min)</p>
                      <p><strong>👥 Pessoas:</strong> {reserva.pessoas}</p>
                      <p className="aprovacao-necessaria">
                        <strong>⚠️ Motivo da aprovação:</strong> Reserva de longa duração (acima de 4 horas)
                      </p>
                    </div>
                    <div className="admin-acoes">
                      <button onClick={() => handleAprovar(reserva.id)} className="btn-aprovar">
                        ✅ Aprovar
                      </button>
                      <button onClick={() => setShowModal(reserva.id)} className="btn-reprovar">
                        ❌ Reprovar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba de Usuários */}
        {abaAtiva === 'usuarios' && (
          <div className="tabela-usuarios">
            <div className="filtros">
              <h3>Filtrar por Modalidade:</h3>
              <div className="botoes-filtro">
                {modalidades.map(mod => (
                  <button
                    key={mod}
                    onClick={() => setFiltro(mod)}
                    className={`btn-filtro ${filtro === mod ? 'ativo' : ''}`}
                  >
                    {mod === 'todos' ? 'Todos' : mod.charAt(0).toUpperCase() + mod.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <h3>Total: {usuariosFiltrados.length} usuários</h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Email</th>
                    <th>Modalidade</th>
                    <th>Matrícula</th>
                    <th>Data Cadastro</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.cpf}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className={`badge-modalidade ${usuario.modalidade}`}>
                          {usuario.modalidade}
                        </span>
                      </td>
                      <td>{usuario.matricula}</td>
                      <td>{new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <span className={`status-badge ${usuario.status}`}>
                          {usuario.status === 'ativo' ? '🟢 Ativo' : '🔴 Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Reprovação */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>❌ Reprovar Reserva</h3>
            <div className="form-group">
              <label>Motivo da Reprovação:</label>
              <textarea
                value={motivoReprovacao}
                onChange={(e) => setMotivoReprovacao(e.target.value)}
                placeholder="Informe o motivo pelo qual esta reserva está sendo reprovada..."
                rows="4"
                required
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => handleReprovar(showModal)} className="btn-reprovar-modal">
                Confirmar Reprovação
              </button>
              <button onClick={() => {
                setShowModal(null);
                setMotivoReprovacao('');
              }} className="btn-cancelar-modal">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCadastros;