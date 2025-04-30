// Importa os componentes visuais do Card
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Importa a função de imagem otimizada do Next.js
import Image from "next/image";
// Imagem padrão usada caso a clínica não tenha imagem cadastrada
import fotoImg from '../../../../public/foto1.png';
// Importa Link para navegação interna no Next.js
import Link from "next/link";
// Ícone de seta para direita
import { ArrowRight } from "lucide-react";
// Importa o tipo Prisma para definir os dados que o componente espera
import { Prisma } from "@prisma/client";
// Importa o selo visual de plano premium
import { PremiumCardBadge } from "./premium-badge";

// Define o tipo que representa um usuário com informações de assinatura (subscription)
type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
  }
}>

// Define a tipagem das props do componente, que espera um array de profissionais
interface ProfessionalsProps {
  professionals: UserWithSubscription[]
}

// Componente que lista todas as clínicas (profissionais) disponíveis
export function Professionals({ professionals }: ProfessionalsProps) {
  return (
    // Seção principal com fundo cinza e padding vertical
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título centralizado da seção */}
        <h2 className="text-3xl text-center mb-12 font-bold">
          Clinicas disponíveis
        </h2>

        {/* Grid responsivo para exibir os cards das clínicas */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Mapeia o array de profissionais e cria um card para cada um */}
          {professionals.map((clinic) => (
            <Card
              className="overflow-hidden hover:shadow-lg duration-300 p-0"
              key={clinic.id} // Chave única para o React
            >
              <CardContent className="p-0">
                <div>
                  {/* Área da imagem da clínica */}
                  <div className="relative h-48">
                    <Image
                      src={clinic.image ?? fotoImg} // Usa imagem da clínica ou imagem padrão
                      alt="Foto da clinica"
                      fill // Preenche todo o espaço da div
                      className="object-cover"
                    />

                    {/* Se o profissional tem plano ativo do tipo "PROFESSIONAL", exibe o selo Premium */}
                    {clinic?.subscription?.status === "active" &&
                      clinic?.subscription?.plan === "PROFESSIONAL" && (
                        <PremiumCardBadge />
                      )}
                  </div>
                </div>

                {/* Conteúdo textual e botão */}
                <div className="p-4 space-y-4 min-h-[160px] flex flex-col justify-between">
                  {/* Nome e endereço da clínica */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {clinic.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {clinic.address ?? "Endereço não informado."}
                      </p>
                    </div>
                  </div>

                  {/* Botão para agendar horário, redireciona para a página da clínica */}
                  <Link
                    href={`/clinica/${clinic.id}`}
                    target="_blank"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-2 rounded-md text-sm md:text-base font-medium"
                  >
                    Agendar horário
                    <ArrowRight className="ml-2" /> {/* Ícone ao lado do texto */}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </section>
  );
}
