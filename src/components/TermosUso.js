import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermosUso = () => {
  const navigate = useNavigate();

  return (
    <div className="termos-container">
      <header className="termos-header">
        <h2>Termos de Uso</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-voltar">Voltar</button>
      </header>

      <div className="termos-content">
        <h3>Termos e Condições de Uso dos Laboratórios e Salas</h3>
        
        <section>
          <h4>1. Modalidades de Usuários</h4>
          <ul>
            <li><strong>Técnico:</strong> Acesso a todas as funcionalidades, até 3 reservas/dia</li>
            <li><strong>Graduação:</strong> Acesso padrão, até 2 reservas/dia</li>
            <li><strong>Educação Básica:</strong> Acesso limitado, até 2 reservas/dia</li>
            <li><strong>Qualificação Profissional:</strong> Acesso conforme regulamento específico</li>
            <li><strong>EJAS:</strong> Acesso conforme regulamento específico</li>
          </ul>
        </section>

        <section>
          <h4>2. Regras de Check-in/Check-out</h4>
          <ul>
            <li>Check-in permitido até 5 minutos antes do horário reservado</li>
            <li>Tolerância de atraso: 15 minutos (máximo 30 minutos)</li>
            <li>Após 30 minutos de atraso, a reserva é automaticamente cancelada</li>
            <li>Check-out deve ser realizado ao finalizar o uso</li>
          </ul>
        </section>

        <section>
          <h4>3. Limites de Reserva</h4>
          <ul>
            <li>Salas: 4 a 5 pessoas por sala</li>
            <li>Computadores: máximo 2 pessoas por equipamento</li>
            <li>Tempo máximo de uso contínuo: 2 horas</li>
            <li>Reservas não podem ser consecutivas para o mesmo recurso</li>
          </ul>
        </section>

        <section>
          <h4>4. Obrigações do Usuário</h4>
          <ul>
            <li>Comparecer para realizar o check-in</li>
            <li>Manter a limpeza e organização do espaço</li>
            <li>Não consumir alimentos ou bebidas nos laboratórios</li>
            <li>Utilizar os equipamentos apenas para fins educacionais</li>
            <li>Respeitar os horários de início e término</li>
          </ul>
        </section>

        <section>
          <h4>5. Penalidades</h4>
          <ul>
            <li>3 faltas sem justificativa: suspensão por 7 dias</li>
            <li>Danos ao patrimônio: responsabilização do usuário</li>
            <li>Uso indevido: cancelamento imediato da reserva</li>
          </ul>
        </section>

        <div className="termos-aceite">
          <p>Ao utilizar o sistema, você concorda com todos os termos acima.</p>
        </div>
      </div>
    </div>
  );
};

export default TermosUso;