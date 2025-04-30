// Função para verificar se a data fornecida é o dia de hoje
export function isToday(date: Date) {
  const now = new Date(); // Pega a data atual

  // Compara ano, mês e dia para saber se é o mesmo dia
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/**
 * Verifica se o horário (slot) já passou em relação ao horário atual.
 */
export function isSlotInThePast(slotTime: string) {
  // Divide o horário recebido em hora e minuto, convertendo para número
  const [slotHour, slotMinute] = slotTime.split(":").map(Number);

  const now = new Date(); // Pega a hora atual
  const currentHour = now.getHours(); // Hora atual
  const currentMinute = now.getMinutes(); // Minuto atual

  // Se a hora do slot for menor que a atual, ele já passou
  if (slotHour < currentHour) {
    return true;
  }
  // Se for a mesma hora, mas o minuto do slot for menor ou igual ao atual, também já passou
  else if (slotHour === currentHour && slotMinute <= currentMinute) {
    return true;
  }

  // Caso contrário, o slot ainda está disponível
  return false;
}

/**
 * Verifica se há uma sequência disponível de horários (slots),
 * ou seja, se a quantidade de horários exigida está livre e contínua.
 */
export function isSlotSequenceAvailable(
  startSlot: string, // Primeiro horário da sequência
  requiredSlots: number, // Quantidade de horários que precisam estar livres
  allSlots: string[], // Todos os horários disponíveis da clínica
  blockedSlots: string[] // Horários que já estão bloqueados (ocupados)
) {
  // Busca o índice do horário de início dentro da lista completa
  const startIndex = allSlots.indexOf(startSlot);

  // Se não encontrar o horário ou se não houver espaço suficiente para a sequência, retorna false
  if (startIndex === -1 || startIndex + requiredSlots > allSlots.length) {
    return false;
  }

  // Verifica se algum dos horários da sequência está bloqueado
  for (let i = startIndex; i < startIndex + requiredSlots; i++) {
    const slotTime = allSlots[i];

    if (blockedSlots.includes(slotTime)) {
      return false; // Se algum estiver bloqueado, não é uma sequência válida
    }
  }

  // Se todos estiverem disponíveis, retorna true
  return true;
}
