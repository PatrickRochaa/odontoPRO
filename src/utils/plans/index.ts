// Define um tipo (type) chamado 'PlanDetailsProps' que descreve os detalhes de um plano.
// No momento, o único detalhe é o número máximo de serviços permitidos.
export type PlanDetailsProps = {
  maxServices: number;
};

// Define um tipo (type) chamado 'PlansProps' que mapeia os tipos de plano disponíveis (BASIC e PROFESSIONAL)
// para suas respectivas configurações descritas em 'PlanDetailsProps'.
export type PlansProps = {
  BASIC: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
};

// Objeto que contém a configuração dos planos disponíveis (quantidade máxima de serviços).
// Os valores são definidos com base no tipo 'PlansProps'.
export const PLANS: PlansProps = {
  BASIC: {
    maxServices: 10, // Plano BASIC permite até 10 serviços cadastrados.
  },
  PROFESSIONAL: {
    maxServices: 50, // Plano PROFESSIONAL permite até 50 serviços cadastrados.
  },
};

// Array que representa os planos disponíveis para exibição na interface (ex: site ou app).
// Cada objeto dentro do array representa um plano com suas informações visuais e funcionais.
export const subscriptionPlans = [
  {
    id: "BASIC", // Identificador do plano (usado no sistema para lógica de permissão e verificação).
    name: "Basic", // Nome que será exibido para o usuário.
    description: "Perfeito para clinicas menores", // Descrição do plano.
    oldPrice: "R$ 97,90", // Preço antigo (pode ser usado para mostrar desconto).
    price: "R$ 27,90", // Preço atual do plano.
    features: [
      `Até ${PLANS["BASIC"].maxServices} serviços`, // Usa o valor definido em PLANS para mostrar a quantidade de serviços permitidos.
      "Agendamentos ilimitados", // Recursos incluídos no plano.
      "Suporte",
      "Relatórios",
    ],
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Ideal para clinicas grandes",
    oldPrice: "R$ 197,90",
    price: "R$ 97,90",
    features: [
      `Até ${PLANS["PROFESSIONAL"].maxServices} serviços`, // Usa o valor de PLANS para manter sincronizado com as regras.
      "Agendamentos ilimitados",
      "Suporte prioritário",
      "Relatórios avançados",
    ],
  },
];
