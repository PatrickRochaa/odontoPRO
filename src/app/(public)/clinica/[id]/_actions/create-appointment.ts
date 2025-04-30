// Indica que esse arquivo será executado no servidor, usando a diretiva do Next.js
"use server";

// Importa a instância do Prisma para interagir com o banco de dados
import prisma from "@/lib/prisma";

// Importa a biblioteca Zod para validação de dados
import { z } from "zod";

// Define o esquema de validação usando Zod
const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"), // Nome é obrigatório
  email: z.string().email("O email é obrigatório"), // Email deve ser válido
  phone: z.string().min(1, "O telefone é obrigatório"), // Telefone é obrigatório
  date: z.date(), // Data deve ser um objeto Date
  serviceId: z.string().min(1, "O serviço é obrigatório"), // Serviço é obrigatório
  time: z.string().min(1, "O horário é obrigatório"), // Horário é obrigatório
  clinicId: z.string().min(1, "O horário é obrigatório"), // Clínica (usuário) é obrigatória
});

// Cria o tipo `FormSchema` automaticamente a partir do `formSchema`
type FormSchema = z.infer<typeof formSchema>;

// Função assíncrona responsável por criar um novo agendamento no banco de dados
export async function createNewAppointment(formData: FormSchema) {
  // Valida os dados recebidos com o esquema Zod
  const schema = formSchema.safeParse(formData);

  // Se a validação falhar, retorna o primeiro erro encontrado
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    // Garante que a data será tratada corretamente, ignorando horas, minutos etc.
    const selectedDate = new Date(formData.date);

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    // Cria uma nova data apenas com o ano, mês e dia (sem horário)
    const appointmentDate = new Date(year, month, day, 0, 0, 0, 0);

    // Cria o agendamento no banco de dados usando Prisma
    const newAppointment = await prisma.appointment.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        time: formData.time,
        appointmentDate: appointmentDate, // Data formatada sem horário
        serviceId: formData.serviceId, // ID do serviço selecionado
        userId: formData.clinicId, // ID do profissional (clínica)
      },
    });

    // Retorna o agendamento criado
    return {
      data: newAppointment,
    };
  } catch (err) {
    // Em caso de erro na requisição (ex: erro de banco), registra no console e retorna mensagem genérica
    console.log(err);
    return {
      error: "Erro ao cadastrar agendamento",
    };
  }
}
