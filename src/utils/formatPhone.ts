// Função que formata um número de telefone brasileiro.
// Ex: "11987654321" -> "(11) 98765-4321"
export function formatPhone(value: string) {
  // Remove todos os caracteres que não forem dígitos (letras, espaços, parênteses, traços, etc.)
  const cleanedValue = value.replace(/\D/g, "");

  // Se o número de dígitos for maior que 11, retorna os primeiros 15 caracteres do valor original (não formatado)
  // Isso evita que o valor exceda o tamanho máximo esperado de um telefone com formatação
  if (cleanedValue.length > 11) {
    return value.slice(0, 15);
  }

  // Aplica a máscara de telefone:
  // 1. Insere parênteses nos dois primeiros dígitos (DDD): ex: "11" vira "(11)"
  // 2. Insere um espaço e os próximos dígitos do telefone
  // 3. Adiciona um traço separando os últimos 4 dígitos
  const formattedValue = cleanedValue
    .replace(/^(\d{2})(\d)/g, "($1) $2") // Coloca parênteses no DDD
    .replace(/(\d{4,5})(\d{4})$/, "$1-$2"); // Adiciona o traço entre os últimos dígitos

  return formattedValue; // Retorna o número já formatado
}

// Função que extrai apenas os números de um telefone formatado.
// Ex: "(11) 98765-4321" -> "11987654321"
export function extractPhoneNumber(phone: string) {
  // Remove todos os caracteres de formatação: parênteses, espaços e traços
  const phoneValue = phone.replace(/[\(\)\s-]/g, "");

  return phoneValue; // Retorna apenas os dígitos
}
