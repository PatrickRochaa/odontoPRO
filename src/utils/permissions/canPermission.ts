"use server"; // Indica que o código será executado no servidor.

import { auth } from "@/lib/auth"; // Importa a função de autenticação para verificar a sessão do usuário.
import { PlanDetailInfo } from "./get-plans"; // Importa o tipo para detalhes do plano.
import prisma from "@/lib/prisma"; // Importa o cliente Prisma para interagir com o banco de dados.
import { canCreateService } from "./canCreateService"; // Importa a função que verifica se o usuário pode criar um serviço.

export type PLAN_PROP = "BASIC" | "PROFESSIONAL" | "TRIAL" | "EXPIRED"; // Define os tipos de planos disponíveis.
type TypeCheck = "service"; // Define os tipos de verificações possíveis, neste caso, apenas "service".

export interface ResultPermissionProp {
  hasPermission: boolean; // Indica se o usuário tem permissão.
  planId: PLAN_PROP; // Identificador do plano atual do usuário.
  expired: boolean; // Indica se o plano está expirado.
  plan: PlanDetailInfo | null; // Detalhes do plano, pode ser nulo se não houver plano.
}

interface CanPermissionProps {
  type: TypeCheck; // Define o tipo de verificação (neste caso, "service").
}

// Função que verifica se o usuário tem permissão para realizar uma ação (dependendo do tipo).
export async function canPermission({
  type,
}: CanPermissionProps): Promise<ResultPermissionProp> {
  const session = await auth(); // Verifica a sessão do usuário autenticado.

  // Se não houver uma sessão válida (usuário não autenticado ou sem ID), retorna um status de sem permissão e plano expirado.
  if (!session?.user?.id) {
    return {
      hasPermission: false,
      planId: "EXPIRED", // Define que o plano está expirado.
      expired: true, // Indica que o plano está expirado.
      plan: null, // Não há plano disponível.
    };
  }

  // Busca a assinatura do usuário no banco de dados usando o Prisma, verificando a associação pelo ID do usuário.
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session?.user?.id, // Filtra pela assinatura do usuário logado.
    },
  });

  // Baseado no tipo de verificação, executa diferentes verificações de permissão.
  switch (type) {
    case "service":
      // Verifica se o usuário tem permissão para criar um serviço, chamando a função canCreateService.
      const permission = await canCreateService(subscription, session);

      return permission; // Retorna o resultado da verificação de permissão para o serviço.

    default:
      // Caso o tipo de verificação não seja "service", retorna um status padrão de sem permissão e plano expirado.
      return {
        hasPermission: false,
        planId: "EXPIRED",
        expired: true,
        plan: null,
      };
  }
}
