import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validarAcesso, precisaAceitarTermos, salvarSessao } from '../services/authService';

// Formata CPF enquanto digita
const formatarCPF = (valor) => {
  const n = valor.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9, 11)}`;
};

// Modal de termos
const TermoModal = ({ usuario, onAceitar, onRecusar }) => {
  const TERMO_COMPLETO = `
    TERMOS DE USO DA BIBLIOTECA

    1. DO ACESSO
       • O acesso à biblioteca é pessoal e intransferível
       • O usuário responsabiliza-se por todas as atividades em sua conta

    2. DOS EMPRÉSTIMOS
       • Prazo de empréstimo: 14 dias para livros, 7 dias para revistas
       • Renovação: permitida apenas se não houver reserva
       • Multa por atraso: R$ 1,00 por dia

    3. DAS RESERVAS
       • Reservas podem ser feitas com até 7 dias de antecedência
       • Cancelamento deve ser feito com 24h de antecedência
       • 3 cancelamentos em 30 dias resultam em suspensão

    4. DO COMPORTAMENTO
       • Manter silêncio nas áreas de estudo
       • Não consumir alimentos nos espaços de acervo
       • Devolver materiais no prazo estabelecido

    Ao aceitar, você concorda com todos os termos acima.
  `;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Termos de Uso</h2>
        <p>Olá, <strong>{usuario?.nome}</strong>. Para continuar, leia e aceite os termos abaixo.</p>
        <div className="termos-texto">
          <pre>{TERMO_COMPLETO}</pre>
        </div>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={onAceitar}>Aceitar e Continuar</button>
          <button className="btn-secondary" onClick={onRecusar}>Recusar</button>
        </div>
      </div>
    </div>
  );
};

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuarioPendente, setUsuarioPendente] = useState(null);

  const handleSubmit = async () => {
    if (!cpf.trim()) {
      setErro("Informe o CPF.");
      return;
    }
    
    setLoading(true);
    setErro("");
    
    // Simular requisição
    setTimeout(() => {
      const resultado = validarAcesso(cpf);
      
      if (!resultado.sucesso) {
        setErro(resultado.erro);
        setLoading(false);
        return;
      }
      
      if (precisaAceitarTermos(resultado.usuario)) {
        setUsuarioPendente(resultado.usuario);
      } else {
        salvarSessao(resultado.usuario);
        onLoginSuccess(resultado.usuario);
        navigate('/dashboard');
      }
      
      setLoading(false);
    }, 800);
  };

  const handleAceitarTermos = () => {
    if (usuarioPendente) {
      const usuarioAtualizado = {
        ...usuarioPendente,
        termosAceitos: true,
        dataAceite: new Date().toISOString().split('T')[0]
      };
      salvarSessao(usuarioAtualizado);
      onLoginSuccess(usuarioAtualizado);
      navigate('/dashboard');
    }
    setUsuarioPendente(null);
  };

  const handleRecusarTermos = () => {
    setUsuarioPendente(null);
    setErro("É necessário aceitar os termos para acessar o sistema.");
    setCpf("");
  };

  if (usuarioPendente) {
    return (
      <TermoModal
        usuario={usuarioPendente}
        onAceitar={handleAceitarTermos}
        onRecusar={handleRecusarTermos}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">📚</div>
          <h1>Biblioteca</h1>
          <p>Sistema de Reservas e Controle de Acesso</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label>CPF do Usuário</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={e => { setCpf(formatarCPF(e.target.value)); setErro(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              disabled={loading}
              autoFocus
            />
          </div>

          {erro && <div className="error-message">{erro}</div>}

          <button 
            className="btn-login"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>

          <div className="login-links">
            <Link to="/cadastro">Não tem cadastro? Cadastre-se</Link>
            <Link to="/termos">Consultar Termos de Uso</Link>
          </div>
        </div>

        <div className="demo-credentials">
          <strong>🔑 Credenciais para teste:</strong>
          <div>Admin: <code>admin.00000000</code></div>
          <div>Usuário ativo: <code>111.111.111-11</code></div>
          <div>Precisa aceitar termos: <code>333.333.333-33</code></div>
          <div>Usuário inativo: <code>555.555.555-55</code></div>
        </div>
      </div>
    </div>
  );
}

export default Login;