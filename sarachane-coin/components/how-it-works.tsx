import Image from "next/image"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 animate-fadeIn text-gradient">Karar Web3 Nasıl Çalışır?</h2>
          <p className="text-lg text-gray-700 animate-fadeIn animation-delay-300">
            Blockchain teknolojisiyle güçlendirilmiş platformumuz, protestoları ve boykotları desteklemenin en güvenli ve şeffaf yolunu sunar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn animation-delay-300 card-hover-effect">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-red-600 text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Web3 Cüzdanınız İle Bağlanın</h3>
            <p className="text-gray-600 mb-4">
              Metamask veya başka bir Web3 cüzdanınızı kullanarak platforma güvenli bir şekilde bağlanın. 
              Karar Coin token'ları otomatik olarak tanınacaktır.
            </p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Güvenli bağlantı</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Gizlilik odaklı deneyim</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn animation-delay-600 card-hover-effect">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-red-600 text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Protestoları Keşfedin ve Destekleyin</h3>
            <p className="text-gray-600 mb-4">
              Aktif protestoları ve boykotları inceleyin, detaylarını öğrenin ve desteklemek istediklerinize token kullanarak güç katın.
            </p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Detaylı filtreleme</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Şeffaf katılım metrikleri</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn animation-delay-900 card-hover-effect">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-red-600 text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Topluluk İle Etkileşime Geçin</h3>
            <p className="text-gray-600 mb-4">
              Kendi protestolarınızı başlatın, öneriler yapın ve diğer aktivistlerle aynı amaç için bir araya gelin.
            </p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Kanıtlanabilir katılım</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Gerçek zamanlı güncellemeler</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center animate-fadeIn animation-delay-1200">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg shadow-lg transform transition-all hover:scale-105">
            Hemen Başlayın <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

