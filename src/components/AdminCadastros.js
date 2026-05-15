import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCadastros = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = () => {
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios') || '[]');
    setUsuarios(usuariosSalvos);
  };

  const usuariosFiltrados = filtro === 'todos' 
    ? usuarios 
    : usuarios.filter(u => u.modalidade === filtro);

  const modalidades = ['todos', 'técnico', 'graduação', 'básica', 'qualificação', 'ejas'];

  return (
    <div className="admin-container">
      <header className="dashboard-header">
        <h2>Gerenciamento de Usuários</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-voltar">
          Voltar ao Dashboard
        </button>
      </header>

      <div className="admin-content">
        <div className="filtros">
          <h3>Filtrar por Modalidade:</h3>
          <div className="botoes-filtro">
            {modalidades.map(mod => (
              <button
                key={mod}
                onClick={() => setFiltro(mod)}
                className={`btn-filtro ${filtro === mod ? 'ativo' : ''}`}
              >
                {mod.charAt(0).toUpperCase() + mod.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="tabela-usuarios">
          <h3>Total: {usuariosFiltrados.length} usuários</h3>
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
                      {usuario.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCadastros;