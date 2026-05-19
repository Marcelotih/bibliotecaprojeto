import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermosUso = () => {
  const navigate = useNavigate();

  return (
    <div className="termos-container">
      <div className="termos-header">
        <h2>📜 Termos de Uso - Sistema de Reservas</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-voltar">Voltar</button>
      </div>

      <div className="termos-content">
        <h3>Regras para Reserva de Salas e Computadores</h3>
        
        <section>
          <h4>1. Modalidades de Usuários e Limites</h4>
          <ul>
            <li><strong>Técnico:</strong> Até 3 reservas por dia, tempo máximo de 2 horas</li>
            <li><strong>Graduação:</strong> Até 2 reservas por dia, tempo máximo de 2 horas</li>
            <li><strong>Educação Básica:</strong> Até 2 reservas por dia, tempo máximo de 1 hora</li>
            <li><strong>Qualificação Profissional:</strong> Até 2 reservas por dia, tempo máximo de 2 horas</li>
            <li><strong>EJAS:</strong> Até 2 reservas por dia, tempo máximo de 2 horas</li>
          </ul>
        </section>

        <section>
          <h4>2. Regras de Check-in</h4>
          <ul>
            <li>✅ Check-in permitido a partir de 5 minutos antes do horário reservado</li>
            <li>⏰ Tolerância de atraso: 15 minutos</li>
            <li>⚠️ Atraso entre 15-30 minutos: check-in permitido com alerta</li>
            <li>❌ Após 30 minutos de atraso: reserva automaticamente cancelada</li>
            <li>🟢 Check-out deve ser realizado ao finalizar o uso</li>
          </ul>
        </section>

        <section>
          <h4>3. Capacidade dos Recursos</h4>
          <ul>
            <li><strong>Salas:</strong> Mínimo 1 pessoa, máximo 5 pessoas por sala</li>
            <li><strong>Computadores:</strong> Mínimo 1 pessoa, máximo 2 pessoas por equipamento</li>
            <li>Respeitar a capacidade máxima dos espaços</li>
          </ul>
        </section>

        <section>
          <h4>4. Obrigações do Usuário</h4>
          <ul>
            <li>✅ Comparecer no horário para realizar o check-in</li>
            <li>✅ Manter a limpeza e organização do espaço</li>
            <li>🚫 Não consumir alimentos ou bebidas nos laboratórios</li>
            <li>📚 Utilizar os equipamentos apenas para fins educacionais</li>
            <li>⏰ Respeitar os horários de início e término</li>
            <li>🔌 Não danificar ou remover equipamentos</li>
          </ul>
        </section>

        <section>
          <h4>5. Penalidades</h4>
          <ul>
            <li>⚠️ 3 faltas sem justificativa: suspensão por 7 dias</li>
            <li>💰 Danos ao patrimônio: responsabilização financeira do usuário</li>
            <li>🚫 Uso indevido: cancelamento imediato da reserva</li>
            <li>📝 Reincidência: perda do direito de reservas por 30 dias</li>
          </ul>
        </section>

        <section>
          <h4>6. Cancelamentos</h4>
          <ul>
            <li>Cancelamento deve ser feito com no mínimo 24 horas de antecedência</li>
            <li>Cancelamentos em cima da hora contam como falta</li>
            <li>3 cancelamentos em 30 dias resultam em suspensão por 15 dias</li>
          </ul>
        </section>

        <div className="termos-aceite">
          <p>✅ Ao utilizar o sistema, você concorda com todos os termos acima.</p>
          <small>Última atualização: Janeiro/2024</small>
        </div>
      </div>
    </div>
  );
};

export default TermosUso;