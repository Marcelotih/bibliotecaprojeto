import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    modalidade: '',
    matricula: '',
    senha: '',
    confirmarSenha: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [passo, setPasso] = useState(1);

  const formatarCPF = (value) => {
    let cpfFormatado = value.replace(/\D/g, '');
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, '$1.$2');
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, '$1.$2');
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpfFormatado;
  };

  const formatarTelefone = (value) => {
    let telefone = value.replace(/\D/g, '');
    telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
    telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');
    return telefone;
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

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      setFormData({ ...formData, cpf: formatarCPF(value) });
    } else if (name === 'telefone') {
      setFormData({ ...formData, telefone: formatarTelefone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validarPasso1 = () => {
    if (!formData.nome || formData.nome.length < 3) {
      setErro('Nome deve ter pelo menos 3 caracteres');
      return false;
    }
    if (!validarCPF(formData.cpf)) {
      setErro('CPF inválido');
      return false;
    }
    if (!formData.dataNascimento) {
      setErro('Data de nascimento é obrigatória');
      return false;
    }
    
    // Verificar maioridade (opcional)
    const hoje = new Date();
    const nascimento = new Date(formData.dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (idade < 14 || (idade === 14 && mes < 0)) {
      setErro('É necessário ter pelo menos 14 anos');
      return false;
    }
    
    return true;
  };

  const validarPasso2 = () => {
    if (!formData.email || !validarEmail(formData.email)) {
      setErro('Email inválido');
      return false;
    }
    if (!formData.telefone || formData.telefone.replace(/\D/g, '').length < 10) {
      setErro('Telefone inválido');
      return false;
    }
    if (!formData.matricula || formData.matricula.length < 5) {
      setErro('Matrícula inválida');
      return false;
    }
    if (!formData.modalidade) {
      setErro('Selecione uma modalidade');
      return false;
    }
    return true;
  };

  const validarPasso3 = () => {
    if (!formData.senha || formData.senha.length < 6) {
      setErro('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setErro('Senhas não conferem');
      return false;
    }
    return true;
  };

  const proximoPasso = () => {
    setErro('');
    
    if (passo === 1 && validarPasso1()) {
      setPasso(2);
    } else if (passo === 2 && validarPasso2()) {
      setPasso(3);
    }
  };

  const passoAnterior = () => {
    setErro('');
    setPasso(passo - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    
    if (!validarPasso3()) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Verificar se CPF já existe
    if (usuarios.some(u => u.cpf === formData.cpf)) {
      setErro('CPF já cadastrado');
      return;
    }

    // Verificar se matrícula já existe
    if (usuarios.some(u => u.matricula === formData.matricula)) {
      setErro('Matrícula já cadastrada');
      return;
    }

    const novoUsuario = {
      id: Date.now(),
      nome: formData.nome,
      cpf: formData.cpf,
      dataNascimento: formData.dataNascimento,
      email: formData.email,
      telefone: formData.telefone,
      modalidade: formData.modalidade,
      matricula: formData.matricula,
      senha: formData.senha, // Em produção, usar hash
      dataCadastro: new Date().toISOString(),
      status: 'ativo',
      termosAceitos: true
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Criar notificação de boas-vindas
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    notificacoes.unshift({
      id: Date.now(),
      userId: novoUsuario.id,
      mensagem: `Bem-vindo ao Sistema de Reservas, ${novoUsuario.nome}!`,
      tipo: 'boas_vindas',
      hora: new Date().toISOString()
    });
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));

    setSucesso('Cadastro realizado com sucesso! Redirecionando...');
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        <h2>Cadastro de Usuário</h2>
        <p className="subtitulo">Sistema de Reservas - Laboratórios e Salas</p>

        {/* Barra de Progresso */}
        <div className="progresso-cadastro">
          <div className={`passo ${passo >= 1 ? 'ativo' : ''}`}>
            <span>1</span>
            Dados Pessoais
          </div>
          <div className={`passo ${passo >= 2 ? 'ativo' : ''}`}>
            <span>2</span>
            Informações Acadêmicas
          </div>
          <div className={`passo ${passo >= 3 ? 'ativo' : ''}`}>
            <span>3</span>
            Segurança
          </div>
        </div>

        {sucesso && (
          <div className="sucesso-mensagem">
            ✅ {sucesso}
          </div>
        )}

        {erro && (
          <div className="erro-mensagem">
            ❌ {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Passo 1 - Dados Pessoais */}
          {passo === 1 && (
            <div className="passo-form">
              <h3>Dados Pessoais</h3>
              
              <div className="form-group">
                <label>Nome Completo:*</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="form-group">
                <label>CPF:*</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  maxLength="14"
                  required
                />
              </div>

              <div className="form-group">
                <label>Data de Nascimento:*</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="button" onClick={proximoPasso} className="btn-proximo">
                Próximo →
              </button>
            </div>
          )}

          {/* Passo 2 - Informações Acadêmicas */}
          {passo === 2 && (
            <div className="passo-form">
              <h3>Informações Acadêmicas</h3>
              
              <div className="form-group">
                <label>Email:*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Telefone:*</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  maxLength="15"
                  required
                />
              </div>

              <div className="form-group">
                <label>Matrícula:*</label>
                <input
                  type="text"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  placeholder="Número da matrícula"
                  required
                />
              </div>

              <div className="form-group">
                <label>Modalidade de Curso:*</label>
                <select
                  name="modalidade"
                  value={formData.modalidade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione a modalidade</option>
                  <option value="técnico">Técnico</option>
                  <option value="graduação">Graduação</option>
                  <option value="básica">Educação Básica</option>
                  <option value="qualificação">Qualificação Profissional</option>
                  <option value="ejas">EJAS</option>
                </select>
              </div>

              <div className="info-modalidade-cadastro">
                <h4>Regras por Modalidade:</h4>
                <ul>
                  <li><strong>Técnico/Graduação:</strong> Até 3 reservas/dia, 2h máx.</li>
                  <li><strong>Educação Básica:</strong> Até 2 reservas/dia, 1h máx.</li>
                  <li><strong>Qualificação/EJAS:</strong> Conforme regulamento específico</li>
                </ul>
              </div>

              <div className="botoes-navegacao">
                <button type="button" onClick={passoAnterior} className="btn-voltar-passo">
                  ← Voltar
                </button>
                <button type="button" onClick={proximoPasso} className="btn-proximo">
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* Passo 3 - Segurança */}
          {passo === 3 && (
            <div className="passo-form">
              <h3>Segurança</h3>
              
              <div className="form-group">
                <label>Senha:*</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmar Senha:*</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Confirme sua senha"
                  required
                />
              </div>

              <div className="termos-checkbox">
                <label>
                  <input type="checkbox" required />
                  Li e aceito os <span onClick={() => navigate('/termos')} className="link-termos">
                    Termos de Uso
                  </span>
                </label>
              </div>

              <div className="botoes-navegacao">
                <button type="button" onClick={passoAnterior} className="btn-voltar-passo">
                  ← Voltar
                </button>
                <button type="submit" className="btn-cadastrar">
                  Finalizar Cadastro ✅
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="link-login">
          Já tem cadastro? <span onClick={() => navigate('/')} className="link">Faça login</span>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;