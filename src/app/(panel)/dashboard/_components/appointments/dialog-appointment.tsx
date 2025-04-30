// Importação dos componentes do Dialog (caixa de diálogo) personalizados da aplicação
import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

// Importação do tipo que representa um agendamento com os dados do serviço associado
import { AppointmentWithService } from "./appointments-list";

// Importação da função `format` do date-fns (não utilizada aqui, mas poderia ser usada para formatar datas)
import { format } from 'date-fns'

// Função utilitária para formatar valores em moeda brasileira
import { formatCurrency } from '@/utils/formatCurrency'

// Definição das propriedades esperadas pelo componente
interface DialogAppointmentProps {
  appointment: AppointmentWithService | null;
}

// Componente que exibe os detalhes de um agendamento dentro de um Dialog (modal)
export function DialogAppointment({ appointment }: DialogAppointmentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Detalhes do agendamento
        </DialogTitle>
        <DialogDescription>
          Veja todos os detalhes do agendamento
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        {/* Verifica se há um agendamento para exibir os detalhes */}
        {appointment && (
          <article>
            {/* Exibe o horário do agendamento */}
            <p><span className="font-semibold">Horario agendado:</span> {appointment.time}</p>

            {/* Exibe a data do agendamento, formatada para pt-BR com fuso UTC */}
            <p className="mb-2">
              <span className="font-semibold">Data do agendamento:</span>{" "}
              {new Intl.DateTimeFormat('pt-BR', {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(appointment.appointmentDate))}
            </p>

            {/* Exibe os dados pessoais do cliente */}
            <p><span className="font-semibold">Nome:</span> {appointment.name}</p>
            <p><span className="font-semibold">Telefone:</span> {appointment.phone}</p>
            <p><span className="font-semibold">Email:</span> {appointment.email}</p>

            {/* Seção separada visualmente para exibir informações do serviço escolhido */}
            <section className="bg-gray-100 mt-4 p-2 rounded-md">
              <p><span className="font-semibold">Serviço:</span> {appointment.service.name}</p>
              <p>
                <span className="font-semibold">Valor:</span>{" "}
                {formatCurrency((appointment.service.price / 100))}
              </p>
            </section>
          </article>
        )}
      </div>
    </DialogContent>
  )
}
