// Importa a função getReminders que busca os lembretes no banco de dados
import { getReminders } from '../../_data-access/get-reminders'

// Importa o componente ReminderList, responsável por exibir a lista de lembretes
import { ReminderList } from './reminder-list'

// Função assíncrona que renderiza os lembretes de um usuário específico
export async function Reminders({ userId }: { userId: string }) {
  // Busca os lembretes no banco de dados passando o userId como parâmetro
  const reminders = await getReminders({ userId: userId })

  // Retorna o componente ReminderList já com os lembretes buscados passados como propriedade
  return (
    <ReminderList reminder={reminders} />
  )
}
