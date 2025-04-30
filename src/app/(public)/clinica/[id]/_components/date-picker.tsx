"use client"; // Indica que esse componente deve ser renderizado no cliente (não no servidor)

// Importa o hook useState do React para trabalhar com estados locais
import { useState } from "react";

// Importa o componente DatePicker (seletor de data) e a função registerLocale da lib react-datepicker
import DatePicker, { registerLocale } from "react-datepicker";

// Importa o idioma português brasileiro da biblioteca date-fns
import { ptBR } from "date-fns/locale/pt-BR";

// Importa o CSS padrão do datepicker
import "react-datepicker/dist/react-datepicker.css";

// Registra o idioma pt-BR para o DatePicker
registerLocale("pt-BR", ptBR);

// Define as propriedades que o componente DateTimePicker pode receber
interface DateTimePickerProps {
  minDate?: Date; // Data mínima permitida para seleção (opcional)
  className?: string; // Classe CSS personalizada para o input (opcional)
  initialDate?: Date; // Data inicial selecionada ao renderizar o componente (opcional)
  onChange: (date: Date) => void; // Função que será chamada quando a data mudar (obrigatória)
}

// Componente DateTimePicker
export function DateTimePicker({
  initialDate,
  className,
  minDate,
  onChange,
}: DateTimePickerProps) {
  // Estado local que armazena a data atualmente selecionada
  // Se não for passada uma initialDate, ele começa com a data atual (new Date())
  const [startDate, setStartDate] = useState(initialDate || new Date());

  // Função que lida com a mudança de data no DatePicker
  function handleChange(date: Date | null) {
    if (date) {
      setStartDate(date); // Atualiza o estado interno com a nova data
      onChange(date); // Chama a função onChange enviada via props para informar a nova data ao componente pai
    }
  }

  return (
    <DatePicker
      className={className} // Aplica a classe personalizada ao input
      selected={startDate} // Define qual data está atualmente selecionada
      locale="pt-BR" // Define o idioma como português brasileiro
      minDate={minDate ?? new Date()} // Define a data mínima permitida (ou hoje se não for passada nenhuma)
      onChange={handleChange} // Função que será chamada ao mudar a data
      dateFormat="dd/MM/yyyy" // Formato que a data será exibida no input
    />
  );
}
