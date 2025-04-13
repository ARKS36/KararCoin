"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AlertCircle, Search, Filter } from "lucide-react"
import ProtestCard from "@/components/protest-card"
import BoycottCard from "@/components/boycott-card"
import { toast } from "@/components/ui/toast"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  
  const [searchInput, setSearchInput] = useState(query)
  const [loading, setLoading] = useState(true)
  const [protestResults, setProtestResults] = useState<any[]>([])
  const [boycottResults, setBoycottResults] = useState<any[]>([])
  const [noResults, setNoResults] = useState(false)
  
  // Örnek protesto verileri - normalde bu veriler API'dan gelecek
  const allProtests = [
    {
      id: 1,
      title: "Üniversite Harç Protestosu",
      location: "İstanbul",
      date: "15.05.2023",
      participants: 2500,
      description: "Öğrenciler, büyük üniversitelerdeki artan harç ücretlerine karşı protesto düzenliyor.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      votes: 1245,
      positiveVotes: 1100,
      negativeVotes: 145,
      status: "Devam Ediyor",
      verified: true,
      category: "Eğitim"
    },
    {
      id: 2,
      title: "Çevre Koruma Mitingi",
      location: "Ankara",
      date: "22.06.2023",
      participants: 1800,
      description: "Vatandaşlar, ormansızlaşma ve çevresel tahribata karşı miting düzenliyor.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      votes: 987,
      positiveVotes: 900,
      negativeVotes: 87,
      status: "Resmi",
      verified: true,
      category: "Çevre"
    },
    {
      id: 3,
      title: "İşçi Hakları Yürüyüşü",
      location: "İzmir",
      date: "10.07.2023",
      participants: 3200,
      description: "İşçi sendikaları daha iyi çalışma koşulları ve adil ücretler için yürüyüş düzenliyor.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      votes: 1567,
      positiveVotes: 1400,
      negativeVotes: 167,
      status: "Onaylandı",
      verified: true,
      category: "İşçi Hakları"
    },
    {
      id: 4,
      title: "Medya Özgürlüğü Gösterisi",
      location: "İstanbul",
      date: "05.08.2023",
      participants: 1500,
      description: "Gazeteciler ve vatandaşlar basın özgürlüğü için ve sansüre karşı gösteri düzenliyor.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      votes: 876,
      positiveVotes: 750,
      negativeVotes: 126,
      status: "Devam Ediyor",
      verified: false,
      category: "İnsan Hakları"
    },
  ]
  
  // Örnek boykot verileri
  const allBoycotts = [
    {
      id: 1,
      title: "Hızlı Moda Boykotu",
      target: "Çeşitli Giyim Markaları",
      category: "Tüketim",
      startDate: "10.03.2023",
      participants: 12500,
      description: "Kötü çalışma koşulları ve çevresel zararlarıyla bilinen hızlı moda markalarına karşı boykot.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      votes: 3245,
      positiveVotes: 2800,
      negativeVotes: 445,
      status: "Resmi",
      verified: true,
    },
    {
      id: 2,
      title: "Teknoloji Devi Veri Gizliliği",
      target: "Büyük Teknoloji Şirketi",
      category: "Teknoloji",
      startDate: "22.04.2023",
      participants: 8700,
      description: "Veri gizliliği ihlalleri ve gözetleme uygulamaları nedeniyle büyük bir teknoloji şirketine karşı boykot.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      votes: 2187,
      positiveVotes: 1900,
      negativeVotes: 287,
      status: "Onaylandı",
      verified: true,
    },
    {
      id: 3,
      title: "Çevresel Tutarsızlık",
      target: "Ünlü Şarkıcı",
      category: "Müzisyenler",
      startDate: "22.05.2023",
      participants: 6700,
      description: "Çevre savunuculuğu yaparken özel jetle seyahat eden ünlü şarkıcıya karşı boykot.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      votes: 1987,
      positiveVotes: 1500,
      negativeVotes: 487,
      status: "Devam Ediyor",
      verified: false,
    },
  ]
  
  // Yeni arama yapmak için form submit fonksiyonu
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) {
      toast.error("Lütfen bir arama terimi girin")
      return
    }
    router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`)
  }
  
  // Arama fonksiyonu - gerçekte bir API çağrısı olacak
  useEffect(() => {
    if (!query) {
      setNoResults(true)
      setLoading(false)
      return
    }
    
    const searchInData = async () => {
      setLoading(true)
      
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Query ile eşleşen protestoları bul (basit bir arama)
      const lowerCaseQuery = query.toLowerCase()
      const matchingProtests = allProtests.filter(protest => 
        protest.title.toLowerCase().includes(lowerCaseQuery) || 
        protest.description.toLowerCase().includes(lowerCaseQuery) ||
        protest.location.toLowerCase().includes(lowerCaseQuery) ||
        protest.category.toLowerCase().includes(lowerCaseQuery)
      )
      
      // Query ile eşleşen boykotları bul
      const matchingBoycotts = allBoycotts.filter(boycott => 
        boycott.title.toLowerCase().includes(lowerCaseQuery) || 
        boycott.description.toLowerCase().includes(lowerCaseQuery) ||
        boycott.target.toLowerCase().includes(lowerCaseQuery) ||
        boycott.category.toLowerCase().includes(lowerCaseQuery)
      )
      
      setProtestResults(matchingProtests)
      setBoycottResults(matchingBoycotts)
      
      setNoResults(matchingProtests.length === 0 && matchingBoycotts.length === 0)
      setSearchInput(query) // Arama çubuğunu güncel query ile eşleştir
      setLoading(false)
    }
    
    searchInData()
  }, [query])
  
  // Oy güncellemesi işleyicisi
  const handleVoteUpdate = (protestId: number, newVotes: number, newPositiveVotes: number, newNegativeVotes: number) => {
    // Gerçek bir uygulamada bu API çağrısı olurdu, şimdilik yerel state'i güncelliyoruz
    toast.success("Oyunuz kaydedildi")
  }
  
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center mb-2">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `"${query}" için arama sonuçları` : "Arama"}
              </h1>
            </div>
            
            {query && <p className="text-gray-600">Türkiye genelindeki protestolar ve boykotlar içinde "{query}" araması.</p>}
            
            {/* Yeni arama formu */}
            <form onSubmit={handleSubmit} className="flex w-full max-w-lg">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Yeni arama yap..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white rounded-r-md"
              >
                <Search className="h-4 w-4 mr-2" />
                Ara
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto py-8 px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
            <span className="ml-2 text-gray-600">Aranıyor...</span>
          </div>
        ) : noResults ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium text-gray-700 mb-2">Sonuç Bulunamadı</h2>
            <p className="text-gray-500 text-center max-w-md mb-8">
              "{query}" için herhangi bir sonuç bulunamadı. Lütfen başka bir arama terimi ile tekrar deneyin veya gezinmeye devam edin.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Geri Dön
              </Button>
              <Button 
                onClick={() => window.location.href = "/protests"}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Tüm Protestoları Göster
              </Button>
            </div>
          </div>
        ) : (
          <>
            {protestResults.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Protestolar ({protestResults.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {protestResults.map(protest => (
                    <ProtestCard 
                      key={protest.id} 
                      protest={protest} 
                      onVoteUpdate={(newVotes, newPositiveVotes, newNegativeVotes) => 
                        handleVoteUpdate(protest.id, newVotes, newPositiveVotes, newNegativeVotes)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            
            {boycottResults.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Boykotlar ({boycottResults.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {boycottResults.map(boycott => (
                    <BoycottCard
                      key={boycott.id}
                      boycott={boycott}
                      onVoteUpdate={handleVoteUpdate}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Geri Dön
              </Button>
            </div>
          </>
        )}
      </section>
      
      <Footer />
    </main>
  )
} 