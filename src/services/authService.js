// Simulação de banco de dados de usuários
const USUARIOS = [
  {
    cpf: "111.111.111-11",
    nome: "João Silva",
    email: "joao@biblioteca.com",
    modalidade: "graduação",
    tipo: "usuario",
    status: "ativo",
    termosAceitos: true,
    dataAceite: "2024-01-15",
    matricula: "2024001",
    telefone: "(11) 99999-1111",
    dataNascimento: "2000-01-01"
  },
  {
    cpf: "222.222.222-22",
    nome: "Maria Santos",
    email: "maria@biblioteca.com",
    modalidade: "técnico",
    tipo: "usuario",
    status: "ativo",
    termosAceitos: true,
    dataAceite: "2024-01-20",
    matricula: "2024002",
    telefone: "(11) 99999-2222",
    dataNascimento: "2001-02-02"
  },
  {
    cpf: "admin.00000000",
    nome: "Administrador",
    email: "admin@biblioteca.com",
    modalidade: "técnico",
    tipo: "admin",
    status: "ativo",
    termosAceitos: true,
    dataAceite: "2024-01-01",
    matricula: "ADMIN001",
    telefone: "(11) 99999-0000",
    dataNascimento: "1980-01-01"
  }
];

const limparCPF = (cpf) => {
  return cpf.replace(/\D/g, "");
};

export const buscarUsuario = (cpf) => {
  const cpfLimpo = limparCPF(cpf);
  
  let usuario = USUARIOS.find(user => limparCPF(user.cpf) === cpfLimpo);
  
  if (!usuario) {
    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuario = usuariosCadastrados.find(u => limparCPF(u.cpf) === cpfLimpo);
  }
  
  return usuario;
};

export const validarAcesso = (cpf) => {
  const usuario = buscarUsuario(cpf);
  
  if (!usuario) {
    return { sucesso: false, erro: "CPF não encontrado no sistema." };
  }
  
  if (usuario.status !== "ativo") {
    return { sucesso: false, erro: "Usuário inativo. Contate a administração." };
  }
  
  return { sucesso: true, usuario };
};

export const precisaAceitarTermos = (usuario) => {
  return usuario && !usuario.termosAceitos;
};

export const salvarSessao = (usuario) => {
  const sessaoData = {
    ...usuario,
    loginTimestamp: Date.now()
  };
  localStorage.setItem('usuario_logado', JSON.stringify(sessaoData));
  localStorage.setItem('usuarioLogado', JSON.stringify(sessaoData));
};

export const recuperarSessao = () => {
  let sessao = localStorage.getItem('usuario_logado');
  if (!sessao) {
    sessao = localStorage.getItem('usuarioLogado');
  }
  
  if (!sessao) return null;
  
  const usuario = JSON.parse(sessao);
  const tempoAtual = Date.now();
  const tempoLogin = usuario.loginTimestamp;
  const horasPassadas = (tempoAtual - tempoLogin) / (1000 * 60 * 60);
  
  if (horasPassadas > 24) {
    localStorage.removeItem('usuario_logado');
    localStorage.removeItem('usuarioLogado');
    return null;
  }
  
  return usuario;
};

export const logout = () => {
  localStorage.removeItem('usuario_logado');
  localStorage.removeItem('usuarioLogado');
};

export const getReservasUsuario = (cpf) => {
  limparReservasExpiradas();
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  return reservas.filter(r => r.cpf === cpf);
};

export const getReservasDoDia = () => {
  limparReservasExpiradas();
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  const hoje = new Date().toDateString();
  
  return reservas.filter(r => {
    const dataReserva = new Date(r.dataHora).toDateString();
    return dataReserva === hoje && r.status !== 'finalizada';
  });
};

export const getAllReservas = () => {
  limparReservasExpiradas();
  return JSON.parse(localStorage.getItem('reservas') || '[]');
};

export const salvarReserva = (reserva) => {
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  
  // Verificar se precisa de aprovação (mais de 4 horas)
  const precisaAprovacao = reserva.duracao > 240; // 4 horas = 240 minutos
  const status = precisaAprovacao ? 'aguardando_aprovacao' : 'aprovada';
  
  const novaReserva = {
    ...reserva,
    id: Date.now().toString(),
    status: status,
    precisaAprovacao: precisaAprovacao,
    dataCriacao: new Date().toISOString()
  };
  
  reservas.push(novaReserva);
  localStorage.setItem('reservas', JSON.stringify(reservas));
  
  return { sucesso: true, reserva: novaReserva, precisaAprovacao };
};

export const aprovarReserva = (reservaId) => {
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  const reservaIndex = reservas.findIndex(r => r.id === reservaId);
  
  if (reservaIndex === -1) return false;
  
  reservas[reservaIndex].status = 'aprovada';
  reservas[reservaIndex].dataAprovacao = new Date().toISOString();
  localStorage.setItem('reservas', JSON.stringify(reservas));
  
  return true;
};

export const reprovarReserva = (reservaId, motivo) => {
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  const reservaIndex = reservas.findIndex(r => r.id === reservaId);
  
  if (reservaIndex === -1) return false;
  
  reservas[reservaIndex].status = 'reprovada';
  reservas[reservaIndex].motivoReprovacao = motivo;
  reservas[reservaIndex].dataReprovacao = new Date().toISOString();
  localStorage.setItem('reservas', JSON.stringify(reservas));
  
  return true;
};

export const atualizarReserva = (reservaId, dadosAtualizados) => {
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  const reservasAtualizadas = reservas.map(r => 
    r.id === reservaId ? { ...r, ...dadosAtualizados } : r
  );
  localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));
};

export const limparReservasExpiradas = () => {
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  const agora = new Date();
  let reservasModificadas = false;
  
  const reservasAtualizadas = reservas.filter(reserva => {
    // Só limpar reservas pendentes/aguardando_aprovacao que expiraram
    if (reserva.status === 'pendente' || reserva.status === 'aguardando_aprovacao') {
      const horaReserva = new Date(reserva.dataHora);
      const diffMinutos = (agora - horaReserva) / 1000 / 60;
      
      // Se passou mais de 1 hora (60 minutos) desde o horário da reserva, remove
      if (diffMinutos > 60) {
        reservasModificadas = true;
        return false;
      }
    }
    return true;
  });
  
  if (reservasModificadas) {
    localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));
  }
  
  return reservasAtualizadas;
};

// Função para verificar e atualizar status de check-in
export const verificarStatusReservas = () => {
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  const agora = new Date();
  let modificado = false;
  
  const reservasAtualizadas = reservas.map(reserva => {
    if (reserva.status === 'aprovada') {
      const horaReserva = new Date(reserva.dataHora);
      const diffMinutos = (agora - horaReserva) / 1000 / 60;
      
      // Se passou mais de 30 minutos e não fez check-in, cancela
      if (diffMinutos > 30) {
        modificado = true;
        return { ...reserva, status: 'cancelada', motivoCancelamento: 'Check-in não realizado no prazo' };
      }
    }
    return reserva;
  });
  
  if (modificado) {
    localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));
  }
  
  return reservasAtualizadas;
};

// Executar verificação periódica
setInterval(() => {
  limparReservasExpiradas();
  verificarStatusReservas();
}, 60000); // A cada minuto