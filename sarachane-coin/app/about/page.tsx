import { Metadata } from "next";
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Lock, Globe, BookOpen, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Hakkımızda | Karar Coin",
  description: "Karar Coin projesi hakkında bilgiler.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">Hakkımızda</h1>
          <p className="text-xl max-w-3xl animate-fadeIn animation-delay-300">
            Karar Coin, Türkiye'deki toplumsal hareketleri desteklemek ve görünür kılmak için kurulmuş bir
            platformdur.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose max-w-none animate-fadeIn">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Misyonumuz</h2>
              <p className="text-lg text-gray-700 mb-6">
                Karar Coin olarak misyonumuz, Türkiye'deki toplumsal hareketleri, protestoları ve boykotları bir
                araya getirerek görünürlüklerini artırmak ve bu hareketlere katılımı teşvik etmektir. Platformumuz,
                insanların seslerini duyurabilecekleri, fikirlerini paylaşabilecekleri ve toplumsal değişime katkıda
                bulunabilecekleri demokratik bir alan sunmaktadır.
              </p>

              <p className="text-lg text-gray-700 mb-6">
                Web3 teknolojisini kullanarak, sahte hesapların ve botların erişemediği, manipülasyona karşı korumalı
                bir platform oluşturduk. Bu sayede, platformumuzdaki her oy ve katılım gerçek insanlar tarafından
                yapılmakta ve toplumun gerçek sesini yansıtmaktadır.
              </p>

              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">Değerlerimiz</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <Shield className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Şeffaflık</h3>
                        <p className="text-gray-700">
                          Platformumuzdaki tüm işlemler ve kararlar şeffaf bir şekilde kaydedilir ve herkes tarafından
                          görüntülenebilir.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <Users className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Topluluk Odaklılık</h3>
                        <p className="text-gray-700">
                          Platformumuz, topluluk tarafından yönetilir ve topluluk için çalışır. Her kullanıcının sesi
                          değerlidir.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <Lock className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Güvenlik</h3>
                        <p className="text-gray-700">
                          Kullanıcılarımızın güvenliği ve gizliliği bizim için en önemli önceliktir. Blockchain
                          teknolojisi ile güvenli bir platform sunuyoruz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <Globe className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Erişilebilirlik</h3>
                        <p className="text-gray-700">
                          Platformumuz, herkesin kolayca erişebileceği ve kullanabileceği şekilde tasarlanmıştır.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">Hikayemiz</h2>
              <p className="text-lg text-gray-700 mb-6">
                Karar Coin, 2023 yılında bir grup aktivist ve teknoloji uzmanı tarafından kurulmuştur. Türkiye'deki
                toplumsal hareketlerin daha görünür olması ve daha geniş kitlelere ulaşması gerektiğine inanan bu ekip,
                Web3 teknolojisinin sunduğu imkanları kullanarak bu platformu hayata geçirmiştir.
              </p>

              <p className="text-lg text-gray-700 mb-6">
                Platformumuzun adı, Türkiye'de toplumsal değişim ve kararlılığın simgesi haline gelmiştir. Karar, hem bir duruş sergilemek hem de geleceğimiz için sorumluluk almak anlamına gelmektedir.
              </p>

              <p className="text-lg text-gray-700 mb-6">
                Bugün, Karar Coin olarak, Türkiye'nin dört bir yanındaki protestoları ve boykotları bir araya
                getirerek, toplumsal hareketlerin gücünü artırmayı ve demokratik katılımı teşvik etmeyi amaçlıyoruz.
              </p>

              <div className="bg-red-50 p-6 rounded-xl border border-red-100 my-8">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Atatürk'ün İzinde</h3>
                    <p className="text-gray-700">
                      Platformumuz, Mustafa Kemal Atatürk'ün "Ey Türk gençliği! Birinci vazifen; Türk istiklalini, Türk
                      cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir." sözlerini rehber edinmiştir. Türkiye
                      Cumhuriyeti'nin demokratik, laik ve sosyal bir hukuk devleti olarak varlığını sürdürmesi için
                      toplumsal hareketlerin önemli olduğuna inanıyoruz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center my-12">
                <Heart className="h-12 w-12 mx-auto mb-4 text-white" />
                <h3 className="text-2xl font-bold mb-4">Bize Katılın</h3>
                <p className="text-lg mb-6">
                  Karar Coin olarak, toplumsal değişime inanan herkesi platformumuza katılmaya davet ediyoruz.
                  Birlikte daha güçlüyüz!
                </p>
                <button className="bg-white text-red-600 hover:bg-red-100 px-6 py-3 rounded-full text-lg font-medium transition-colors">
                  Şimdi Katıl
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

