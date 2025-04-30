// Define que esse componente/função será usado no lado do cliente (Client Component)
"use client";

// Importa o Zod, uma biblioteca para validação e criação de schemas
import { z } from "zod";

// Importa o adaptador do Zod para ser usado com o React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";

// Importa o hook principal do React Hook Form
import { useForm } from "react-hook-form";

// Define um schema (modelo/validação) para o formulário de agendamento
export const appointmentSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"), // O campo 'name' deve ser uma string com no mínimo 1 caractere
  email: z.string().email("O email é obrigatório"), // O campo 'email' deve ser um email válido
  phone: z.string().min(1, "O telefone é obrigatório"), // O campo 'phone' deve ter no mínimo 1 caractere
  date: z.date(), // O campo 'date' deve ser uma data válida
  serviceId: z.string().min(1, "O serviço é obrigatório"), // O campo 'serviceId' também deve ter no mínimo 1 caractere
});

// Cria um tipo TypeScript automaticamente a partir do schema acima
export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Hook personalizado que configura e retorna os métodos do React Hook Form já com validação
export function useAppointmentForm() {
  return useForm<AppointmentFormData>({
    // Usa o schema do Zod para validar os campos do formulário
    resolver: zodResolver(appointmentSchema),
    // Define os valores padrões do formulário ao inicializar
    defaultValues: {
      name: "", // Valor inicial do campo nome
      email: "", // Valor inicial do campo email
      phone: "", // Valor inicial do campo telefone
      serviceId: "", // Valor inicial do campo serviço
      date: new Date(), // Valor inicial do campo data (data atual)
    },
  });
}
