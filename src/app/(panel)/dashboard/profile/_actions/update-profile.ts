// Define que este código roda no servidor (Server Actions do Next.js)
"use server";

// Importa a função de autenticação da aplicação
import { auth } from "@/lib/auth";

// Importa a instância do Prisma ORM para interagir com o banco de dados
import prisma from "@/lib/prisma";

// Função do Next.js para revalidar o cache da rota (SSR/ISR)
import { revalidatePath } from "next/cache";

// Importa o Zod, uma biblioteca de validação de esquemas
import { z } from "zod";

// Criação do esquema de validação com Zod para o formulário de perfil
const formSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }), // Nome é obrigatório
  address: z.string().optional(), // Endereço é opcional
  phone: z.string().optional(), // Telefone é opcional
  status: z.boolean(), // Status é obrigatório e deve ser booleano
  timeZone: z.string(), // Fuso horário é obrigatório
  times: z.array(z.string()), // Lista de horários, cada item deve ser string
});

// Cria um tipo TypeScript com base no schema validado
type FormSchema = z.infer<typeof formSchema>;

// Função responsável por atualizar o perfil do usuário no banco de dados
export async function updateProfile(formData: FormSchema) {
  // Recupera a sessão/autenticação do usuário
  const session = await auth();

  // Verifica se existe um usuário logado com ID válido
  if (!session?.user?.id) {
    return {
      error: "Usuário não encontrado", // Retorna erro se não houver usuário
    };
  }

  // Valida os dados do formulário com base no schema criado
  const schema = formSchema.safeParse(formData);

  // Se a validação falhar, retorna erro
  if (!schema.success) {
    return {
      error: "Preencha todos os campos", // Mensagem de erro padrão
    };
  }

  try {
    // Atualiza os dados do usuário no banco de dados
    await prisma.user.update({
      where: {
        id: session?.user?.id, // Localiza o usuário pelo ID
      },
      data: {
        name: formData.name, // Atualiza nome
        address: formData.address, // Atualiza endereço
        phone: formData.phone, // Atualiza telefone
        status: formData.status, // Atualiza status
        timeZone: formData.timeZone, // Atualiza fuso horário
        times: formData.times || [], // Atualiza lista de horários (ou array vazio)
      },
    });

    // Revalida o cache da página de perfil do dashboard para mostrar as mudanças
    revalidatePath("/dashboard/profile");

    // Retorna sucesso
    return {
      data: "Clinica atualizada com sucesso!",
    };
  } catch (err) {
    // Caso ocorra algum erro inesperado, exibe no console
    console.log(err);
    return {
      error: "Falha ao atualizar clincia", // Mensagem de erro padrão
    };
  }
}
