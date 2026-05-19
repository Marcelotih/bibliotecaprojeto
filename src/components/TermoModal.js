import { Btn, Card } from "./componentes";

const TERMO_COMPLETO = `
TERMOS DE USO DA BIBLIOTECA

1. DO ACESSO
   1.1. O usuário declara ser o titular do CPF informado ou estar devidamente autorizado.
   1.2. O acesso à biblioteca é pessoal e intransferível.
   1.3. Empréstimos e reservas são de responsabilidade do titular do cadastro.

2. DAS RESPONSABILIDADES
   2.1. O usuário responsabiliza-se pela guarda e conservação do material emprestado.
   2.2. Devoluções fora do prazo estão sujeitas a multas conforme regulamento.
   2.3. Danos ou perdas de materiais deverão ser comunicados imediatamente.

3. DOS PRAZOS
   3.1. Livros: 14 dias (renovável por mais 14 dias)
   3.2. Revistas: 07 dias (não renovável)
   3.3. Material de referência: consulta local apenas

4. DAS PENALIDADES
   4.1. Multa por atraso: R$ 1,00 por dia por item
   4.2. Perda de materiais: reposição do título + multa de 50%
   4.3. 3 ocorrências de atraso: suspensão por 30 dias

5. DISPOSIÇÕES GERAIS
   5.1. O usuário permite o uso de seus dados para comunicação e controle.
   5.2. Este termo é válido por 12 meses, devendo ser renovado anualmente.
   5.3. Caso de dúvidas, procure a administração da biblioteca.

Ao clicar em "Aceitar", você confirma estar de acordo com todos os termos acima.
`;

export function TermoModal({ usuario, onAceitar, onRecusar }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      zIndex: 1000
    }}>
      <Card style={{ maxWidth: 560, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>Termos de Uso</h2>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#666" }}>
          Olá, <strong>{usuario?.nome}</strong>. Para continuar, leia e aceite os termos abaixo.
        </p>
        <div style={{
          background: "#f9f9f7",
          borderRadius: 8,
          padding: "1rem",
          fontSize: 12,
          overflowY: "auto",
          marginBottom: 16,
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          color: "#555",
          flex: 1
        }}>
          {TERMO_COMPLETO}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="primary" onClick={onAceitar} style={{ flex: 1 }}>Aceitar e Continuar</Btn>
          <Btn onClick={onRecusar} variant="secondary">Recusar</Btn>
        </div>
      </Card>
    </div>
  );
}