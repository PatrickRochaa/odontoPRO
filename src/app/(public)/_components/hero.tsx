// Importa o componente de botão personalizado
import { Button } from "@/components/ui/button";

// Importa o componente de imagem otimizada do Next.js
import Image from "next/image";

// Importa imagem local da pasta public
import doctorImg from "../../../../public/doctor-hero.png";

// Componente Hero, responsável pela seção principal (destaque) da página
export function Hero() {
  return (
    // Seção com fundo branco
    <section className="bg-white">
      {/* Container centralizado com padding nas laterais e espaçamento superior e inferior */}
      <div className="container mx-auto px-4 pt-20 pb-4 sm:pb-0 sm:px-6 lg:px-8">
        {/* Área principal com layout responsivo: coluna no mobile, linha no desktop */}
        <main className="flex items-center justify-center flex-col md:flex-row">

          {/* Texto principal da seção, ocupa mais espaço (flex: 2) */}
          <article className="flex-[2] max-w-3xl space-y-8 flex flex-col justify-center">
            {/* Título de destaque */}
            <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">
              Encontre os melhores profissionais em um único local!
            </h1>

            {/* Parágrafo explicativo abaixo do título */}
            <p className="text-base md:text-lg text-gray-600">
              Nós somos uma plataforma para profissionais de saúde com foco em
              agilizar seu atendimento de forma simples e organizada.
            </p>

            {/* Botão chamando para ação */}
            <Button className="bg-emerald-500 hover:bg-emerald-400 w-fit px-6 font-semibold">
              Encontre uma clínica
            </Button>
          </article>

          {/* Imagem ilustrativa ao lado do conteúdo textual */}
          <div>
            <Image
              src={doctorImg} // Caminho da imagem
              alt="Foto ilustrativa de um médico" // Texto alternativo
              width={340} // Largura da imagem
              height={400} // Altura da imagem
              quality={100} // Qualidade máxima
              className="object-contain" // Garante que a imagem se encaixe bem sem distorcer
            />
          </div>
        </main>
      </div>
    </section>
  );
}
