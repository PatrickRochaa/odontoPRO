// Rota backend: meusite.com/api/schedule/get-appointments

// Importa o cliente do Prisma para interações com o banco de dados
import prisma from "@/lib/prisma";
// Importa os tipos necessários do Next.js
import { NextRequest, NextResponse } from "next/server";

// Função que lida com requisições GET
export async function GET(request: NextRequest) {
  // Extrai os parâmetros da URL da requisição
  const { searchParams } = request.nextUrl;

  // Pega os valores de 'userId' e 'date' da URL
  const userId = searchParams.get("userId");
  const dateParam = searchParams.get("date");

  // Verifica se os parâmetros necessários foram passados e são válidos
  if (!userId || userId === "null" || !dateParam || dateParam === "null") {
    return NextResponse.json(
      {
        error: "Nenhum agendamento encontrado",
      },
      {
        status: 400,
      }
    );
  }

  try {
    // Converte a data recebida (yyyy-mm-dd) em um intervalo de início e fim do dia (UTC)
    const [year, month, day] = dateParam.split("-").map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    console.log("START DATE: ", startDate);
    console.log("END DATE: ", endDate);

    // Busca o usuário no banco de dados com base no userId
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    // Se o usuário não existir, retorna erro
    if (!user) {
      return NextResponse.json(
        {
          error: "Nenhum agendamento encontrado",
        },
        {
          status: 400,
        }
      );
    }

    // Busca os agendamentos do usuário para aquela data específica
    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
        appointmentDate: {
          gte: startDate, // a partir do início do dia
          lte: endDate, // até o fim do dia
        },
      },
      include: {
        service: true, // Inclui os dados do serviço relacionado a cada agendamento
      },
    });

    // Cria um Set para guardar todos os horários que já estão ocupados
    const blockedSlots = new Set<string>();

    // Itera sobre cada agendamento
    for (const apt of appointments) {
      // Ex: apt.time = "10:00", apt.service.duration = 60 minutos
      // Calcula quantos blocos de 30 minutos são necessários para aquele serviço
      const requiredSlots = Math.ceil(apt.service.duration / 30);
      const startIndex = user.times.indexOf(apt.time); // Posição do horário inicial na agenda do usuário

      // Marca os horários que serão ocupados por esse agendamento
      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const blockedSlot = user.times[startIndex + i];
          if (blockedSlot) {
            blockedSlots.add(blockedSlot); // Adiciona ao Set de horários bloqueados
          }
        }
      }
    }

    // Converte o Set para array
    const blockedtimes = Array.from(blockedSlots);

    console.log("blockedtimes: ", blockedtimes);

    // Retorna os horários bloqueados como resposta JSON
    return NextResponse.json(blockedtimes);
  } catch (err) {
    console.log(err);
    // Retorna erro genérico em caso de falha
    return NextResponse.json(
      {
        error: "Nenhum agendamento encontrado",
      },
      {
        status: 400,
      }
    );
  }
}
