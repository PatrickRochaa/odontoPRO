"use server"; // Indica que este código será executado no lado do servidor.

import { Session } from "next-auth"; // Importa o tipo de sessão do NextAuth para tipar a função.
import { addDays, isAfter } from "date-fns"; // Importa funções para manipulação de datas.
import { ResultPermissionProp } from "./canPermission"; // Importa a estrutura do tipo de retorno da função.
import { TRIAL_DAYS } from "@/utils/permissions/trial-limits"; // Importa o número de dias permitidos para o período de teste gratuito.

export async function checkSubscriptionExpired(
  session: Session
): Promise<ResultPermissionProp> {
  // Calcula a data final do período de teste, somando TRIAL_DAYS à data de criação do usuário.
  const trailEndDate = addDays(session?.user?.createdAt!, TRIAL_DAYS);

  // Verifica se a data atual é depois da data de fim do período de teste.
  if (isAfter(new Date(), trailEndDate)) {
    // Se o período de teste já expirou, retorna que o usuário não tem permissão.
    return {
      hasPermission: false, // Sem permissão para usar os recursos protegidos.
      planId: "EXPIRED", // Identificador de que o plano expirou.
      expired: true, // Indica que o plano está expirado.
      plan: null, // Nenhum plano ativo associado.
    };
  }

  // Caso o período de teste ainda esteja válido, o usuário tem permissão.
  return {
    hasPermission: true, // Permissão garantida.
    planId: "TRIAL", // Plano atual é o de teste gratuito.
    expired: false, // Indica que o plano ainda está dentro da validade.
    plan: null, // Nenhum plano detalhado retornado (pode ser tratado separadamente).
  };
}
