'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import LogoImg from "../../public/logo-odonto.png"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 gap-6">
      {/* Logotipo da clínica */}
      <Image
        src={LogoImg}
        alt="Logo OdontoPro"
        width={200}
        height={60}
        priority
      />

      <h1 className="text-4xl font-bold">404 - Página não encontrada</h1>
      <p className="text-lg text-gray-600">
        A página que você procura não existe ou foi removida.
      </p>

      <Button onClick={() => router.push('/')} className="bg-emerald-500 hover:bg-emerald-400 w-fit px-6 font-semibold cursor-pointer">
        Voltar para a página inicial
      </Button>
    </div>
  )
}
