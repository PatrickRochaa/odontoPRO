// Importa o botão estilizado personalizado
import { Button } from '@/components/ui/button'

// Função para buscar a sessão do usuário autenticado
import getSesion from '@/lib/getSession'

// Ícone de calendário da biblioteca Lucide
import { Calendar } from 'lucide-react'

// Componente de navegação/link do Next.js
import Link from 'next/link'

// Redirecionamento do Next.js para rotas protegidas
import { redirect } from 'next/navigation'

// Botão personalizado que copia o link da clínica
import { ButtonCopyLink } from './_components/button-copy-link'

// Lista de lembretes de agendamento
import { Reminders } from './_components/reminder/reminders'

// Lista de agendamentos do dia
import { Appointments } from './_components/appointments/appointments'

// Função que verifica o status da assinatura do usuário
import { checkSubscription } from '@/utils/permissions/checkSubscription'

// Componente que exibe um alerta se a assinatura estiver expirada
import { LabelSubscription } from '@/components/ui/label-subscription'

// Função assíncrona do componente de página
export default async function Dashboard() {
  // Recupera a sessão do usuário (usuário logado)
  const session = await getSesion()

  // Se o usuário não estiver autenticado, redireciona para a home
  if (!session) {
    redirect("/")
  }

  // Verifica o status da assinatura do usuário (ativa, trial ou expirada)
  const subscription = await checkSubscription(session?.user?.id!)

  return (
    <main>
      {/* Cabeçalho com botões de ação */}
      <div className='space-x-2 flex items-center justify-end'>
        {/* Botão para abrir a página pública da clínica e permitir novos agendamentos */}
        <Link
          href={`/clinica/${session.user?.id}`}
          target='_blank' // abre em nova aba
        >
          <Button className='bg-emerald-500 hover:bg-emerald-400 flex-1 md:flex-[0]'>
            <Calendar className='w-5 h-5' />
            <span>Novo agendamento</span>
          </Button>
        </Link>

        {/* Botão que copia o link da clínica para compartilhar */}
        <ButtonCopyLink userId={session.user?.id!} />
      </div>

      {/* Exibe aviso se a assinatura estiver expirada */}
      {subscription?.subscriptionStatus === "EXPIRED" && (
        <LabelSubscription expired={true} />
      )}

      {/* Exibe mensagem especial se o usuário estiver no período de teste */}
      {subscription?.subscriptionStatus === "TRIAL" && (
        <div className='bg-green-500 text-white text-sm md:text-base px-3 py-2 rounded-md my-2'>
          <p className='font-semibold'>
            {subscription?.message}
          </p>
        </div>
      )}

      {/* Se a assinatura for válida (não expirada), exibe agendamentos e lembretes */}
      {subscription?.subscriptionStatus !== "EXPIRED" && (
        <section className='grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4'>
          <Appointments userId={session.user?.id!} />
          <Reminders userId={session.user?.id!} />
        </section>
      )}

    </main>
  )
}
