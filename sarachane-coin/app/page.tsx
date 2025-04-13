"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ProtestCard from "@/components/protest-card"
import BoycottCard from "@/components/boycott-card"
import TokenInfo from "@/components/token-info"
import HowItWorks from "@/components/how-it-works"
import AtaturkQuote from "@/components/ataturk-quote"
import Footer from "@/components/footer"
import Link from "next/link"
import { getBoycotts, getProtests } from "@/lib/data-service"
import { Boycott, Protest } from "@/lib/types"
import { toast } from "@/components/ui/toast"

export default function Home() {
  const [protests, setProtests] = useState<Protest[]>([])
  const [boycotts, setBoycotts] = useState<Boycott[]>([])
  const [featuredItems, setFeaturedItems] = useState<Array<Protest | Boycott>>([])
  const [loading, setLoading] = useState(true)
  const [isPopularityFilter, setIsPopularityFilter] = useState(false)
  
  // Veri yükleme fonksiyonu
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Boykot ve protestoları yükle
        const boycottData = await getBoycotts()
        const protestData = await getProtests()
        
        // Sadece onaylanmış ve aktif olanları al
        const activeBoycotts = boycottData.filter(b => b.status === "Aktif")
        const activeProtests = protestData.filter(p => p.status === "Aktif")
        
        setBoycotts(activeBoycotts)
        setProtests(activeProtests)
        
        // İlk 6 öğeyi birleştir ve göster (varsayılan sıralama)
        const combined = [...activeBoycotts, ...activeProtests]
        // Yeni eklenenleri üstte göster
        const sorted = combined.sort((a, b) => b.id - a.id)
        
        setFeaturedItems(sorted.slice(0, 6))
        
      } catch (error) {
        console.error("Veri yükleme hatası:", error)
        toast.error("Veriler yüklenirken bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Popülerliğe göre filtreleme
  const filterByPopularity = () => {
    setIsPopularityFilter(!isPopularityFilter)
    
    if (!isPopularityFilter) {
      // Popülerliğe göre sırala (katılımcı sayısına göre)
      const combinedItems = [...boycotts, ...protests]
      const sorted = combinedItems.sort((a, b) => b.participants - a.participants)
      setFeaturedItems(sorted.slice(0, 6))
    } else {
      // Varsayılan sıralamaya dön (yeniden eskiye)
      const combinedItems = [...boycotts, ...protests]
      const sorted = combinedItems.sort((a, b) => b.id - a.id)
      setFeaturedItems(sorted.slice(0, 6))
    }
  }
  
  // Oy güncelleme işleyicisi
  const handleVoteUpdate = (itemId: number, isBoycott: boolean, newVotes: number, newPositiveVotes: number, newNegativeVotes: number) => {
    if (isBoycott) {
      // Boykotları güncelle
      setBoycotts(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, positiveVotes: newPositiveVotes, negativeVotes: newNegativeVotes } 
          : item
      ))
    } else {
      // Protestoları güncelle
      setProtests(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, positiveVotes: newPositiveVotes, negativeVotes: newNegativeVotes } 
          : item
      ))
    }
    
    // Gösterilen öğeleri güncelle
    setFeaturedItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, positiveVotes: newPositiveVotes, negativeVotes: newNegativeVotes }
        : item
    ))
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <AtaturkQuote />

      <section className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Aktif Protestolar & Boykotlar</h2>
          <Button 
            variant="outline" 
            className={`${isPopularityFilter ? 'bg-red-50 text-red-600' : ''} hover:shadow-md transition-all duration-300`}
            onClick={filterByPopularity}
          >
            {isPopularityFilter ? 'Varsayılan Sıralama' : 'Popülerliğe Göre Sırala'}
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
          <>
            {featuredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <div key={`${item.id}-${item.hasOwnProperty('target') ? 'boycott' : 'protest'}`} className="transition-all duration-300 transform hover:-translate-y-1">
                    {/* Boykot mu protesto mu kontrol et */}
                    {item.hasOwnProperty('target') ? (
                      // Boykot
                      <BoycottCard
                        boycott={item as Boycott}
                        onVoteUpdate={(id, votes, positiveVotes, negativeVotes) => 
                          handleVoteUpdate(id, true, votes, positiveVotes, negativeVotes)
                        }
                      />
                    ) : (
                      // Protesto
                      <ProtestCard
                        protest={item as Protest}
                        onVoteUpdate={(id, votes, positiveVotes, negativeVotes) => 
                          handleVoteUpdate(id, false, votes, positiveVotes, negativeVotes)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Henüz onaylanmış protesto veya boykot bulunmuyor.</p>
              </div>
            )}
          </>
        )}
        
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/protests">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-md transform transition-all hover:scale-105">
              Tüm Protestoları Gör
            </Button>
          </Link>
          <Link href="/boycotts">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-md transform transition-all hover:scale-105">
              Tüm Boykotları Gör
            </Button>
          </Link>
        </div>
      </section>

      <HowItWorks />
      <TokenInfo />
      <Footer />
    </main>
  )
}

