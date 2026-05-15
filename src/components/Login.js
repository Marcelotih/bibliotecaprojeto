import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const formatarCPF = (value) => {
    let cpfFormatado = value.replace(/\D/g, '');
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, '$1.$2');
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, '$1.$2');
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpfFormatado;
  };

  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
    
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!validarCPF(cpf)) {
      setErro('CPF inválido');
      return;
    }
    
    if (!dataNascimento) {
      setErro('Data de nascimento é obrigatória');
      return;
    }

    // Simulação de login - em produção, validaria no backend
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.cpf === cpf && u.dataNascimento === dataNascimento);
    
    if (usuario || cpf.replace(/\D/g, '') === '12345678901') {
      localStorage.setItem('usuarioLogado', JSON.stringify({
        cpf,
        dataNascimento,
        nome: usuario?.nome || 'Usuário Teste',
        modalidade: usuario?.modalidade || 'técnico'
      }));
      navigate('/dashboard');
    } else {
      setErro('Usuário não encontrado');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sistema de Reservas</h2>
        <p className="subtitulo">Laboratórios e Salas de Estudo</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>CPF:</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              maxLength="14"
              placeholder="000.000.000-00"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Data de Nascimento:</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </div>
          
          {erro && <div className="erro-mensagem">{erro}</div>}
          
          <button type="submit" className="btn-login">Entrar</button>
        </form>
        // Adicione após o botão de login, antes do fechamento da div login-box:
        <div className="link-cadastro">
        Não tem cadastro? <span onClick={() => navigate('/cadastro')} className="link">
        Cadastre-se aqui
        </span>
        </div>
        
        <div className="info-uteis">
          <h4>Informações Importantes:</h4>
          <ul>
            <li>Check-in: até 5 min de antecedência</li>
            <li>Tolerância de atraso: 15 min (máx. 30 min)</li>
            <li>Salas: 4-5 pessoas</li>
            <li>Computadores: 2 pessoas por equipamento</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;