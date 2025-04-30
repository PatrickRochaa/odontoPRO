// Define que o componente roda no cliente (necessário para hooks como useState, useQuery etc.)
"use client"

import { useState } from 'react'
// Hook para acessar parâmetros da URL
import { useSearchParams } from 'next/navigation'

// Componente para adicionar rolagem à lista de horários
import { ScrollArea } from '@/components/ui/scroll-area'

// Importação dos componentes de cartão (layout de agendamentos)
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'

// React Query: hook para buscar dados e manipular cache
import { useQuery, useQueryClient } from '@tanstack/react-query'
// Função para formatar datas
import { format } from 'date-fns'
// Tipo do agendamento com os dados do serviço incluso
import { Prisma } from '@prisma/client'

// Botão estilizado
import { Button } from '@/components/ui/button'
// Ícones para visualizar e cancelar agendamentos
import { X, Eye } from 'lucide-react'

// Função para cancelar agendamento
import { cancelAppointment } from '../../_actions/cancel-appointment'
// Biblioteca para exibir mensagens (toast)
import { toast } from 'sonner'

// Diálogo para detalhes do agendamento
import {
  Dialog,
  DialogTrigger
} from '@/components/ui/dialog'

// Componente com detalhes do agendamento
import { DialogAppointment } from './dialog-appointment'
// Componente com o botão para escolher a data
import { ButtonPickerAppointment } from './button-date'

// Tipo com agendamento incluindo dados do serviço
export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true,
  }
}>

interface AppointmentsListProps {
  times: string[] // Horários disponíveis (ex: ["08:00", "08:30", ...])
}

export function AppointmentsList({ times }: AppointmentsListProps) {

  // Lê a data da URL (?date=2025-05-01, por exemplo)
  const searchParams = useSearchParams();
  const date = searchParams.get("date")

  // Cache do React Query
  const queryClient = useQueryClient();

  // Controla o estado do diálogo e qual agendamento será exibido
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null)

  // Busca os agendamentos da clínica para a data selecionada
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {
      let activeDate = date;

      // Se nenhuma data estiver na URL, usa a data de hoje
      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM-dd")
        activeDate = today;
      }

      // Chamada para API que retorna os agendamentos
      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`
      const response = await fetch(url)
      const json = await response.json() as AppointmentWithService[];

      if (!response.ok) {
        return []
      }

      return json
    },
    staleTime: 20000, // Considera os dados válidos por 20s
    refetchInterval: 60000, // Atualiza a cada 60s
  })

  // Cria um mapa que relaciona horários com os agendamentos ocupando aquele horário
  const occupantMap: Record<string, AppointmentWithService> = {}

  if (data && data.length > 0) {
    for (const appointment of data) {
      // Descobre quantos "blocos de 30 minutos" o serviço ocupa
      const requiredSlots = Math.ceil(appointment.service.duration / 30);

      // Posição do horário inicial no array de horários disponíveis
      const startIndex = times.indexOf(appointment.time)

      // Se o horário inicial foi encontrado
      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;

          // Marca todos os horários ocupados pelo agendamento
          if (slotIndex < times.length) {
            occupantMap[times[slotIndex]] = appointment;
          }
        }
      }
    }
  }

  // Cancela um agendamento
  async function handleCancelAppointment(appointmentId: string) {
    const response = await cancelAppointment({ appointmentId: appointmentId })

    if (response.error) {
      toast.error(response.error);
      return;
    }

    // Atualiza a lista após cancelamento
    queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
    await refetch()
    toast.success(response.data);
  }

  return (
    // Diálogo que abre ao clicar para visualizar detalhes
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        {/* Cabeçalho do cartão */}
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-xl md:text-2xl font-bold'>
            Agendamentos
          </CardTitle>

          {/* Botão para mudar a data do agendamento */}
          <ButtonPickerAppointment />
        </CardHeader>

        <CardContent>
          {/* Área com rolagem para exibir os horários */}
          <ScrollArea className='h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4'>
            {isLoading ? (
              <p>Carregando agenda...</p>
            ) : (
              // Mapeia os horários e exibe se estão ocupados ou disponíveis
              times.map((slot) => {
                const occupant = occupantMap[slot]

                if (occupant) {
                  return (
                    <div
                      key={slot}
                      className='flex items-center py-2 border-t last:border-b'
                    >
                      <div className='w-16 text-sm font-semibold'>{slot}</div>

                      <div className='flex-1 text-sm'>
                        <div className='font-semibold'>{occupant.name}</div>
                        <div className='text-sm text-gray-500'>
                          {occupant.phone}
                        </div>
                      </div>

                      <div className='ml-auto'>
                        <div className='flex'>
                          {/* Botão para ver detalhes do agendamento */}
                          <DialogTrigger asChild>
                            <Button
                              className='cursor-pointer'
                              variant="ghost"
                              size="icon"
                              onClick={() => setDetailAppointment(occupant)}
                            >
                              <Eye className='w-4 h-4' />
                            </Button>
                          </DialogTrigger>

                          {/* Botão para cancelar o agendamento */}
                          <Button
                            className='cursor-pointer'
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancelAppointment(occupant.id)}
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                }

                // Se não houver ocupação, mostra como disponível
                return (
                  <div
                    key={slot}
                    className='flex items-center py-2 border-t last:border-b'
                  >
                    <div className='w-16 text-sm font-semibold'>{slot}</div>
                    <div className='flex-1 text-sm'>
                      Disponível
                    </div>
                  </div>
                )
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Componente que mostra o detalhe do agendamento no diálogo */}
      <DialogAppointment
        appointment={detailAppointment}
      />
    </Dialog>
  )
}
