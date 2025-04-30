/**
 * Função que converte um valor monetário em reais (string) para centavos (número inteiro)
 * @param {string} amount - valor monetário em R$ para ser convertido
 * @returns {number} o valor convertido em centavos
 */
export function convertRealToCents(amount: string) {
  // Substitui os pontos por nada (remove os pontos dos milhares) e depois substitui a vírgula por ponto
  // Ex: "1.234,56" → "1234.56"
  const numericPrice = parseFloat(amount.replace(/\./g, "").replace(",", "."));

  // Converte o valor para centavos (multiplica por 100) e arredonda para o número inteiro mais próximo
  // Ex: 1234.56 → 123456
  const priceInCents = Math.round(numericPrice * 100);

  // Retorna o valor em centavos
  return priceInCents;
}
