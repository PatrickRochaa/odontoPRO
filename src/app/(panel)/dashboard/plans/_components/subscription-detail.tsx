"use client" // Indica que este componente deve ser renderizado no cliente (Client Component do Next.js)

// Importa o tipo Subscription do Prisma (contém informações da assinatura do usuário)
import { Subscription } from "@prisma/client";

// Importa o sistema de notificações
import { toast } from 'sonner'

// Importa os componentes visuais do card (cabeçalho, conteúdo, rodapé, etc.)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'

// Importa os dados dos planos disponíveis (BASIC, PROFESSIONAL, etc.)
import { subscriptionPlans } from '@/utils/plans/index'

// Importa o botão customizado usado no projeto
import { Button } from "@/components/ui/button";

// Importa a função que cria a URL de gerenciamento da assinatura no Stripe
import { createPortalCustomer } from '../_actions/create-portal-customer'

// Tipagem das props que o componente recebe
interface SubscriptionDetailProps {
  subscription: Subscription; // Dados da assinatura ativa do usuário
}

// Componente que exibe os detalhes da assinatura atual do usuário
export function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {

  // Busca as informações completas do plano da assinatura atual (ex: features, nome, preço)
  const subscriptionInfo = subscriptionPlans.find(plan => plan.id === subscription.plan)

  // Função para redirecionar o usuário ao portal do cliente no Stripe (gerenciamento da assinatura)
  async function handleManageSubscription() {
    const portal = await createPortalCustomer()

    // Se houver erro, exibe uma notificação e cancela a ação
    if (portal.error) {
      toast.error("Ocorreu um erro ao criar o portal de assinatura")
      return;
    }

    // Se tudo der certo, redireciona para o Stripe Portal
    window.location.href = portal.sessionId;
  }

  // Renderização do componente
  return (
    <Card className="w-full mx-auto"> {/* Card geral com largura total */}
      <CardHeader>
        <CardTitle className="text-2xl">Seu Plano Atual</CardTitle>
        <CardDescription>
          Sua assinatura está ativa!
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Exibe o nome do plano e o status da assinatura */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg md:text-xl">
            {subscription.plan === "BASIC" ? "BASIC" : "PROFISSIONAL"}
          </h3>

          {/* Badge de status do plano */}
          <div className="bg-green-500 text-white w-fit px-4 py-1 rounded-md">
            {subscription.status === "active" ? "ATIVO" : "INATIVO"}
          </div>
        </div>

        {/* Lista de recursos do plano, se encontrados */}
        <ul className="list-disc list-inside space-y-2">
          {subscriptionInfo && subscriptionInfo.features.map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>

      {/* Botão para gerenciar a assinatura via Stripe */}
      <CardFooter>
        <Button onClick={handleManageSubscription}>
          Gerenciar assinatura
        </Button>
      </CardFooter>
    </Card>
  )
}
