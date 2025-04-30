// Cria um formatador de moeda usando a API Intl.NumberFormat do JavaScript.
// Este formatador é configurado para o idioma "pt-BR" (Português do Brasil),
// e para a moeda "BRL" (Real Brasileiro), com estilo de moeda.
// A opção `minimumFractionDigits: 0` garante que não apareçam centavos (ex: R$ 10 em vez de R$ 10,00).
const CURRENCY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  currency: "BRL", // Define que a moeda é o Real Brasileiro
  style: "currency", // Estilo de exibição como moeda (ex: R$ 50)
  minimumFractionDigits: 0, // Não mostrar casas decimais (ex: R$ 20 em vez de R$ 20,00)
});

// Função utilitária que recebe um número e retorna esse valor formatado como moeda BRL.
// Por exemplo, formatCurrency(150) retorna "R$ 150"
export function formatCurrency(number: number) {
  return CURRENCY_FORMATTER.format(number);
}
