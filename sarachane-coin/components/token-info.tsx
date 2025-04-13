import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"

export default function TokenInfo() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Image 
              src="/images/logo.png" 
              alt="Karar Coin Logo" 
              width={90} 
              height={90} 
              className="mb-2 rounded-full shadow-lg p-2 bg-red-50 border-2 border-red-200"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 animate-fadeIn">Karar Coin</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeIn animation-delay-300">
            Kullanıcıların önemsedikleri protesto ve boykotlara katılmalarına olanak tanıyan topluluk platformu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 animate-fadeIn animation-delay-300">
            <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <TrendingUp className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Toplumsal Hareketleri Destekle</h3>
            <p className="text-gray-600">
              Karar Coin'i inandığınız protesto ve boykotları doğrudan desteklemek için kullanın, görünürlük ve etki
              kazanmalarına yardımcı olun.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 animate-fadeIn animation-delay-600">
            <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Güvenli & Şeffaf</h3>
            <p className="text-gray-600">
              Blockchain teknolojisi üzerine kurulu, tüm katılımların ve desteklerin şeffaf ve güvenli olmasını sağlar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 animate-fadeIn animation-delay-900">
            <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Zap className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Topluluk Katılımı</h3>
            <p className="text-gray-600">
              Protestolara katılarak, bilgi paylaşarak veya platformun büyümesine katkıda bulunarak toplumsal değişime
              destek olun.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl overflow-hidden shadow-xl animate-fadeIn animation-delay-1200">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
            <div className="md:w-2/3 mb-8 md:mb-0 text-white relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Fark yaratmaya hazır mısınız?</h3>
              <p className="text-red-100 mb-6">
                Bugün Karar Coin platformuna katılın ve sizin için önemli olan hareketleri desteklemeye başlayın.
                Seslerini duyuran binlerce aktiviste katılın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-red-600 hover:bg-red-100 shadow-md transform transition-all hover:scale-105">Platformu Keşfet</Button>
                <Button variant="outline" className="text-white border-white hover:bg-red-700 shadow-md transform transition-all hover:scale-105">
                  Daha Fazla Bilgi <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center relative z-10">
              <div className="bg-white rounded-full p-6 shadow-lg animate-bounce-slow border-4 border-red-300">
                <Image 
                  src="/images/logo.png" 
                  alt="Karar Coin" 
                  width={200} 
                  height={200} 
                  className="w-40 h-40" 
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

