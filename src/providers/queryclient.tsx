// Define que este componente será executado no cliente (navegador), não no servidor
"use client"

// Importa os objetos necessários do React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Componente que fornece um contexto de QueryClient para toda a aplicação
export function QueryClientContext({ children }: { children: React.ReactNode }) {
  // Cria uma nova instância do QueryClient, que gerencia os dados em cache das requisições
  const queryClient = new QueryClient()

  return (
    // O QueryClientProvider torna o queryClient acessível para todos os componentes filhos que usam React Query
    <QueryClientProvider client={queryClient}>
      {children} {/* Renderiza os componentes filhos dentro do provedor */}
    </QueryClientProvider>
  )
}
