// Importa o ícone de estrela da biblioteca Lucide
import { Star } from "lucide-react";

// Componente responsável por exibir um selo/ícone indicando que o cartão é "Premium"
export function PremiumCardBadge() {
  return (
    // Div posicionada no canto superior direito do card
    <div className="absolute top-2 right-2 bg-yellow-500 w-12 h-12 z-[2] rounded-full flex items-center justify-center">
      {/* Ícone de estrela branca, indicando destaque ou item premium */}
      <Star className="text-white" />
    </div>
  )
}
