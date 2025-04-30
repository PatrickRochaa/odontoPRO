// Importa função que recupera a sessão atual do usuário logado
import getSession from '@/lib/getSession'

// Importa função do Next.js usada para redirecionar rotas do lado do servidor
import { redirect } from 'next/navigation'

// Importa o componente que mostra os planos disponíveis para assinatura
import { GridPlans } from './_components/grid-plans'

// Importa função que busca os dados da assinatura do usuário (status, plano, etc.)
import { getSubscription } from '@/utils/get-subscription'

// Importa componente que mostra os detalhes da assinatura ativa
import { SubscriptionDetail } from './_components/subscription-detail'

// Componente principal da página de planos
export default async function Plans() {
  // Recupera a sessão do usuário logado
  const session = await getSession()

  // Se o usuário não estiver logado, redireciona para a página inicial
  if (!session) {
    redirect("/")
  }

  // Busca os dados da assinatura vinculada ao ID do usuário da sessão
  const subscritpion = await getSubscription({ userId: session?.user?.id! })

  return (
    <div>
      {/* Se o usuário NÃO tiver uma assinatura ativa, exibe os planos disponíveis */}
      {subscritpion?.status !== "active" && (
        <GridPlans />
      )}

      {/* Se o usuário TIVER uma assinatura ativa, exibe os detalhes da assinatura */}
      {subscritpion?.status === "active" && (
        <SubscriptionDetail subscription={subscritpion!} />
      )}
    </div>
  )
}
