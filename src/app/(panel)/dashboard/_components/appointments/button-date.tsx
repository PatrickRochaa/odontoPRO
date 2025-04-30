// Indica que este componente será renderizado no lado do cliente
"use client"

import { ChangeEvent, useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

// Componente responsável por exibir um seletor de data e atualizar a URL com o valor escolhido
export function ButtonPickerAppointment() {
  const router = useRouter();

  // Estado que armazena a data selecionada, iniciando com a data atual no formato yyyy-MM-dd
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))

  // Função chamada ao alterar a data no input
  function handleChangeDate(event: ChangeEvent<HTMLInputElement>) {
    // Atualiza o estado com a nova data
    setSelectedDate(event.target.value)

    // Cria uma nova URL baseada na URL atual da página
    const url = new URL(window.location.href)

    // Define o novo parâmetro de busca "date" na URL
    url.searchParams.set("date", event.target.value)

    // Atualiza a URL da página, acionando a navegação para a nova rota com o parâmetro atualizado
    router.push(url.toString())
  }

  return (
    <input
      type="date"
      id="start"
      className="border-2 px-2 py-1 rounded-md text-sm md:text-base"
      value={selectedDate}
      onChange={handleChangeDate}
    />
  )
}
