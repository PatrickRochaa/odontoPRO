"use server"; // Diretiva que indica que este código será executado no lado do servidor (Server Actions do Next.js 13+).

// Importa o tipo 'Plan' do Prisma, que representa os tipos de planos disponíveis no banco de dados (ex: BASIC, PROFESSIONAL).
import { Plan } from "@prisma/client";

// Importa a tipagem 'PlansProps' de um utilitário local, que define como deve ser a estrutura dos dados dos planos (ex: quantidade de serviços permitidos).
import { PlansProps } from "@/utils/plans/index";

// Define uma interface chamada 'PlanDetailInfo', que descreve as informações detalhadas de um plano.
// Neste caso, ela possui apenas um campo: 'maxServices' (quantidade máxima de serviços permitidos).
export interface PlanDetailInfo {
  maxServices: number;
}

// Objeto que contém os limites definidos para cada tipo de plano.
// Esse objeto implementa a estrutura de 'PlansProps' importada anteriormente.
const PLANS_LIMITS: PlansProps = {
  BASIC: {
    maxServices: 3, // O plano 'BASIC' permite no máximo 3 serviços cadastrados pelo usuário.
  },
  PROFESSIONAL: {
    maxServices: 50, // O plano 'PROFESSIONAL' permite até 50 serviços cadastrados.
  },
};

// Função assíncrona que retorna os detalhes (limites) de um plano específico.
// Recebe como parâmetro 'planId' do tipo 'Plan' (que pode ser, por exemplo, 'BASIC' ou 'PROFESSIONAL').
export async function getPlan(planId: Plan) {
  // Retorna os limites definidos no objeto 'PLANS_LIMITS' com base no identificador do plano recebido.
  // Ex: getPlan("BASIC") retorna { maxServices: 3 }
  return PLANS_LIMITS[planId];
}
