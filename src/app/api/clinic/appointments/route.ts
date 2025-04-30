// Importa o middleware de autenticação personalizada
import { auth } from "@/lib/auth";
// Importa a instância do Prisma para interações com o banco de dados
import prisma from "@/lib/prisma";
// Importa os tipos necessários para requisições e respostas HTTP
import { NextResponse, NextRequest } from "next/server";

/*
  Rota para buscar todos os agendamentos de uma clínica

  > Precisa receber a data como parâmetro de busca (query string)
  > O ID da clínica será obtido a partir do usuário autenticado (não pode vir pela rota diretamente)
*/

// Define o handler da rota GET, protegida pelo middleware de autenticação
export const GET = auth(async function GET(request) {
  // Verifica se o usuário está autenticado
  if (!request.auth) {
    return NextResponse.json(
      { error: "Acesso não autorizado!" },
      { status: 401 }
    );
  }

  // Recupera os parâmetros da URL (query string)
  const searchParams = request.nextUrl.searchParams;
  // Pega o parâmetro "date" da URL e força a tipagem como string
  const dateString = searchParams.get("date") as string;
  // Obtém o ID da clínica a partir do usuário autenticado
  const clinicId = request.auth?.user?.id;

  // Validação: se a data não foi fornecida, retorna erro
  if (!dateString) {
    return NextResponse.json({ error: "Data não informada!" }, { status: 400 });
  }

  // Validação: se não encontrou o ID da clínica, retorna erro
  if (!clinicId) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 400 }
    );
  }

  try {
    // Transforma a data recebida (formato "YYYY-MM-DD") em partes numéricas
    const [year, month, day] = dateString.split("-").map(Number);

    // Cria um intervalo de datas UTC para o dia inteiro
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Início do dia
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)); // Fim do dia

    // Busca os agendamentos no banco que pertencem à clínica e estão dentro da data especificada
    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId, // Relacionado ao dono dos agendamentos (clínica)
        appointmentDate: {
          gte: startDate, // Maior ou igual ao início do dia
          lte: endDate, // Menor ou igual ao fim do dia
        },
      },
      include: {
        service: true, // Inclui os detalhes do serviço agendado
      },
    });

    // Retorna os agendamentos encontrados em formato JSON
    return NextResponse.json(appointments);
  } catch (err) {
    // Caso aconteça algum erro, exibe no console e retorna uma resposta de erro
    console.log(err);
    return NextResponse.json(
      { error: "Falha ao buscar agendamentos" },
      { status: 400 }
    );
  }
}) as any; // TypeScript pode precisar desse `as any` para lidar com tipos do middleware
