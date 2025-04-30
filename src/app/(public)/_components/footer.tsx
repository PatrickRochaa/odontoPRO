// Função que define o componente de rodapé (footer) da aplicação
export function Footer() {
  return (
    // Elemento <footer> com padding vertical e centralização de texto
    // Aplica classes utilitárias do Tailwind CSS para estilo:
    // py-6: espaçamento vertical, text-center: centraliza texto,
    // text-gray-500: cor cinza para o texto, text-sm/md:text-base: tamanho do texto adaptável
    <footer className="py-6 text-center text-gray-500 text-sm md:text-base">

      {/* Parágrafo contendo os direitos reservados + nome da aplicação */}
      <p>
        {/* Texto fixo + ano atual dinâmico com new Date().getFullYear() */}
        Todos os direito reservados @{new Date().getFullYear()}

        {/* Espaço entre os elementos com margem horizontal */}
        <span className="mx-1"> - </span>

        {/* Nome da aplicação em destaque */}
        <strong className="font-bold text-zinc-900">
          Odonto
          {/* Parte "PRO" do nome com cor esmeralda */}
          <span className="text-emerald-500">PRO</span>
        </strong>
      </p>

    </footer>
  );
}
