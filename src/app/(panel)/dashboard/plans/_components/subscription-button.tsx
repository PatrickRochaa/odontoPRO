"use client" // Indica que esse componente roda no lado do cliente (Client Component do Next.js)

// Importa o botão customizado do projeto
import { Button } from "@/components/ui/button"

// Importa o tipo Plan definido pelo Prisma (BASIC ou PROFESSIONAL, por exemplo)
import { Plan } from "@prisma/client"

// Importa a função responsável por criar a assinatura (comunica com o servidor/Stripe)
import { createSubscription } from '../_actions/create-subscription'

// Importa o sistema de notificações
import { toast } from 'sonner'

// Importa função que retorna a instância do Stripe.js para redirecionamento ao checkout
import { getStripeJs } from '@/utils/stripe-js'

// Define a tipagem das props recebidas pelo componente
interface SubscriptionButtonProps {
  type: Plan // Define o tipo de plano: "BASIC" ou "PROFESSIONAL"
}

// Componente responsável por exibir o botão de assinar e lidar com a ação de compra
export function SubscriptionButton({ type }: SubscriptionButtonProps) {

  // Função chamada ao clicar no botão: cria a sessão de pagamento
  async function handleCreateBilling() {

    // Faz a requisição para criar a assinatura no backend e recebe o ID da sessão do Stripe ou erro
    const { sessionId, error } = await createSubscription({ type: type })

    // Se houver erro, exibe toast com a mensagem e cancela o fluxo
    if (error) {
      toast.error(error)
      return;
    }

    // Obtém o Stripe.js carregado no lado do cliente
    const stripe = await getStripeJs();

    // Se o Stripe estiver carregado corretamente, redireciona o usuário para o checkout
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: sessionId })
    }
  }

  // Renderiza o botão estilizado
  return (
    <Button
      // Define estilos adicionais se for o plano "PROFESSIONAL"
      className={`w-full cursor-pointer ${type === "PROFESSIONAL" && "bg-emerald-500 hover:bg-emerald-400"}`}

      // Ao clicar, chama a função para iniciar o processo de assinatura
      onClick={handleCreateBilling}
    >
      Ativar assinatura
    </Button>
  )
}
