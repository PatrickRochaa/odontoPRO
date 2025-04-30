// Importa a função responsável por buscar os horários disponíveis da clínica
import { getTimesClinic } from '../../_data-access/get-times-clinic'

// Importa o componente que exibe a lista de agendamentos
import { AppointmentsList } from './appointments-list'

// Componente assíncrono que representa os agendamentos da clínica
export async function Appointments({ userId }: { userId: string }) {
  // Busca os horários disponíveis da clínica com base no ID do usuário (usuário logado ou responsável pela clínica)
  const { times } = await getTimesClinic({ userId: userId })

  // Renderiza o componente AppointmentsList passando os horários como prop
  return (
    <AppointmentsList times={times} />
  )
}
