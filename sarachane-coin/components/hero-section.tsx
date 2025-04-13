"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export default function HeroSection() {
  const router = useRouter()
  
  // Protestolar sayfasına yönlendirme fonksiyonu
  const navigateToProtests = () => {
    router.push("/protests")
  }
  
  // Token satın alma fonksiyonu (şimdilik bildirim gösterecek)
  const buyTokens = () => {
    toast.info("Karar Coin satın alma özelliği yakında hizmetinizde olacak!")
  }
  
  return (
    <section className="bg-gradient-to-r from-red-700 to-red-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">Karar Coin ile Değişimi Destekle</h1>
            <p className="text-xl mb-6 animate-fadeIn animation-delay-300">
              Türkiye genelindeki protestolar ve boykotlar hakkında bilgi edinin. Toplumsal hareketlere katılın ve
              destek olun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn animation-delay-600">
              <Button 
                className="bg-white text-red-600 hover:bg-red-100 px-6 py-3 rounded-full text-lg"
                onClick={navigateToProtests}
              >
                Protestolar Hakkında Bilgi Al
              </Button>
              <Button 
                className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-full text-lg"
                onClick={buyTokens}
              >
                Karar Coin Edin
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 animate-fadeIn animation-delay-900">
              <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full opacity-30 animate-pulse animation-delay-300"></div>
              <div className="absolute inset-8 bg-white rounded-full opacity-40 animate-pulse animation-delay-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-6 shadow-lg animate-spin-slow border-4 border-red-300">
                  <Image
                    src="/images/logo.png"
                    alt="Karar Coin Logo"
                    width={180}
                    height={180}
                    className="w-36 h-36 md:w-44 md:h-44"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

