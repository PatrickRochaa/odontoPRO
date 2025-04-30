"use client"; // Define que este componente será renderizado no lado do cliente (Client Component do Next.js)

import { Button } from "@/components/ui/button"; // Importa o componente de botão customizado
import { TimeSlot } from "./schedule-content"; // Importa o tipo TimeSlot, que define a estrutura de cada horário
import { cn } from "@/lib/utils"; // Função utilitária para concatenar classes CSS de forma condicional
import {
  isSlotInThePast, // Função que verifica se um horário já passou
  isToday, // Função que verifica se a data selecionada é hoje
  isSlotSequenceAvailable, // Função que verifica se há uma sequência de horários disponíveis
} from "./schedule-utils";

// Define o tipo das props que o componente recebe
interface ScheduleTimeListProps {
  selectedDate: Date; // Data selecionada pelo usuário
  selectedTime: string; // Horário selecionado atualmente
  requiredSlots: number; // Quantidade de horários consecutivos necessários para o serviço
  blockedTimes: string[]; // Horários bloqueados (indisponíveis para agendamento)
  availableTimeSlots: TimeSlot[]; // Lista de horários disponíveis com status (disponível ou não)
  clinicTimes: string[]; // Todos os horários possíveis de funcionamento da clínica
  onSelectTime: (time: string) => void; // Função chamada ao selecionar um horário
}

// Componente responsável por listar os horários disponíveis para agendamento
export function ScheduleTimeList({
  selectedDate,
  availableTimeSlots,
  blockedTimes,
  clinicTimes,
  requiredSlots,
  selectedTime,
  onSelectTime,
}: ScheduleTimeListProps) {
  // Verifica se a data selecionada é hoje
  const dateIsToday = isToday(selectedDate);

  return (
    // Cria um grid responsivo de 3 colunas em telas pequenas e 5 colunas em telas médias
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {/* Mapeia todos os horários disponíveis para renderizar os botões */}
      {availableTimeSlots.map((slot) => {
        // Verifica se há uma sequência suficiente de horários disponíveis a partir do horário atual
        const sequenceOK = isSlotSequenceAvailable(
          slot.time,
          requiredSlots,
          clinicTimes,
          blockedTimes
        );

        // Verifica se o horário já passou (apenas se for o dia atual)
        const slotIsPast = dateIsToday && isSlotInThePast(slot.time);

        // Um horário só será habilitado se estiver disponível, a sequência for válida e não for um horário passado
        const slotEnabled = slot.available && sequenceOK && !slotIsPast;

        return (
          <Button
            // Se o horário estiver habilitado, ao clicar será chamado o onSelectTime com o horário atual
            onClick={() => slotEnabled && onSelectTime(slot.time)}
            type="button"
            variant="outline" // Estilização do botão
            key={slot.time} // Chave única para renderização eficiente
            className={cn(
              "h-10 select-none", // Altura padrão e impede seleção de texto
              selectedTime === slot.time &&
                "border-2 border-emerald-500 text-primary", // Se for o horário selecionado, destaca o botão
              !slotEnabled && "opacity-50 cursor-not-allowed" // Se não estiver habilitado, aplica opacidade e desativa o cursor
            )}
            disabled={!slotEnabled} // Desabilita o botão se o horário não for válido
          >
            {/* Mostra o horário no botão */}
            {slot.time}
          </Button>
        );
      })}
    </div>
  );
}
