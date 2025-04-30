// Define que o código será executado no lado do cliente (Client Component do Next.js)
"use client"

// Importa o Zod para criação e validação de schemas
import { z } from 'zod'

// Integração do Zod com react-hook-form para usar o schema como validador
import { zodResolver } from '@hookform/resolvers/zod'

// Importa o hook principal do react-hook-form
import { useForm } from 'react-hook-form'

// Criação do schema de validação usando Zod
export const reminderSchema = z.object({
  // O campo description deve ser uma string com no mínimo 1 caractere
  description: z.string().min(1, "A descrição do lembrete é obrigatória"),
})

// Tipagem dos dados do formulário com base no schema criado
export type ReminderFormdata = z.infer<typeof reminderSchema>

// Hook customizado que configura o formulário com validação e valores iniciais
export function useReminderForm() {
  return useForm<ReminderFormdata>({
    // Define que a validação será feita usando o Zod
    resolver: zodResolver(reminderSchema),

    // Valores padrões do formulário
    defaultValues: {
      description: ""
    }
  })
}
