"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AlertCircle, Filter, SlidersHorizontal, Users, Calendar, MapPin, ChevronDown, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/toast"
import ProtestCard from "@/components/protest-card"
import { useBlockchain } from "@/app/providers"
import { getProtests, updateProtest } from "@/lib/data-service"
import { Protest } from "@/lib/types"

// Kullanıcı oyları için tip tanımı - localstorage için kullanılan sade versiyon
interface UserVote {
  id: string;
  type: "positive" | "negative";
  count: number;
  timestamp: string;
}

export default function ProtestsPage() {
  // Blockchain context'inden cüzdan verileri
  const { address } = useBlockchain()
  
  // Verileri tutacak state
  const [protests, setProtests] = useState<Protest[]>([])
  
  // Filtreleme ve sıralama state'leri
  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("latest") // latest, mostParticipants, mostSupported
  const [showOnlyVerified, setShowOnlyVerified] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Kullanıcı oyları için state
  const [userVotes, setUserVotes] = useState<UserVote[]>([])
  const [showUserVotes, setShowUserVotes] = useState(false)
  
  // Protestoları yükle
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProtests();
        setProtests(data);
      } catch (error) {
        console.error("Protestoları yükleme hatası:", error);
        toast.error("Protestolar yüklenirken bir hata oluştu");
      }
    }
    
    loadData();
  }, []);
  
  // Protestoları filtrele
  const filteredProtests = protests.filter(protest => {
    // Konum filtreleme
    if (activeLocation && protest.location !== activeLocation) {
      return false
    }
    
    // Sadece doğrulanmış protestoları göster
    if (showOnlyVerified && protest.status !== "Aktif") {
      return false
    }
    
    return true
  })
  
  // Protestoları sırala
  const sortedProtests = [...filteredProtests].sort((a, b) => {
    if (sortBy === "mostParticipants") {
      return b.participants - a.participants
    } else if (sortBy === "mostSupported") {
      return b.positiveVotes - a.positiveVotes
    } else {
      // En son (varsayılan)
      return a.id < b.id ? 1 : -1
    }
  })
  
  // Görüntülenecek protestolar
  const visibleProtests = sortedProtests.slice(0, visibleCount)
  
  // Konum listesi
  const locations = [...new Set(protests.map(p => p.location).filter(Boolean))]
  
  // Daha fazla yükle
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3)
    
    // Eğer tüm protestolar yüklendiyse bildirim göster
    if (visibleCount + 3 >= sortedProtests.length) {
      toast.info("Tüm protestolar yüklendi")
    }
  }
  
  // Filtreleri temizle
  const clearFilters = () => {
    setActiveLocation(null)
    setSortBy("latest")
    setShowOnlyVerified(false)
    toast.success("Filtreler temizlendi")
  }
  
  // Oy güncellemesi işleyicisi
  const handleVoteUpdate = async (protestId: number, newVotes: number, newPositiveVotes: number, newNegativeVotes: number) => {
    try {
      // Protestoyu bul
      const protestToUpdate = protests.find(p => p.id === protestId);
      
      if (protestToUpdate) {
        // Protestoyu güncelle
        const updatedProtest = {
          ...protestToUpdate,
          positiveVotes: newPositiveVotes,
          negativeVotes: newNegativeVotes
        };
        
        // Data service ile güncelle
        const success = await updateProtest(updatedProtest);
        
        if (success) {
          // Yerel state'i güncelle
          setProtests(prevProtests => 
            prevProtests.map(p => 
              p.id === protestId ? updatedProtest : p
            )
          );
          
          console.log(`Oy güncellendi: ID=${protestId}, Votes=${newVotes}, Positive=${newPositiveVotes}, Negative=${newNegativeVotes}`);
        }
      }
    } catch (error) {
      console.error("Oy güncelleme hatası:", error);
    }
  }

  // LocalStorage'dan kullanıcı oylarını yükle
  useEffect(() => {
    if (address) {
      const userVotesArray: UserVote[] = [];
      // LocalStorage'daki tüm anahtarları tara
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Kullanıcının oy anahtarlarını bul - protestolar için
        if (key && key.startsWith('vote_protest_') && key.includes(`_${address}`)) {
          try {
            // Oy verisini parse etmeyi dene
            const voteValue = localStorage.getItem(key) || '{}';
            let voteData;
            
            try {
              // JSON formatında mı kontrol et
              voteData = JSON.parse(voteValue);
            } catch (parseError) {
              // Eski format - string olarak kaydedilmiş ("positive" veya "negative")
              console.log("Eski format oy verisi dönüştürülüyor", voteValue);
              voteData = {
                type: voteValue,
                count: 1,
                timestamp: new Date().toISOString()
              };
              
              // Eski formatı yeni formata dönüştür ve kaydet
              localStorage.setItem(key, JSON.stringify(voteData));
            }
            
            // Protest ID'sini keyden çıkar
            const idMatch = key.match(/vote_protest_(\d+)_/);
            const protestId = idMatch ? idMatch[1] : 'unknown';
            
            userVotesArray.push({
              id: protestId,
              type: voteData.type,
              count: voteData.count || 1,
              timestamp: voteData.timestamp || new Date().toISOString()
            });
          } catch (error) {
            console.error("Oy verisi ayrıştırma hatası:", error);
          }
        }
      }
      
      // En son oyları üstte göster
      userVotesArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setUserVotes(userVotesArray);
    }
  }, [address]);
  
  // Protesto getirme işleyicisi - ID'ye göre protesto bulma
  const findProtestById = (id: string) => {
    return protests.find(p => p.id.toString() === id);
  };
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-600">
              Protestolar
            </h1>
            <p className="text-xl text-gray-600">
              Türkiye'deki aktif protestoları keşfedin, destekleyin ve katılın
            </p>
          </div>
          
          {/* Filtreleme ve Sıralama */}
          <div className="mb-8 bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-red-500" />
                <span className="font-medium text-gray-800">Filtrele:</span>
              </div>
              
              <Button
                variant="ghost"
                className={`justify-start hover:bg-red-100 hover:text-red-700 ${isFilterOpen ? 'border-b border-red-200 pb-2' : ''}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtreler
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sırala:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-red-200 rounded p-2 text-sm w-44 text-gray-800"
                  >
                    <option value="latest">En Yeni</option>
                    <option value="mostParticipants">En Çok Katılımcı</option>
                    <option value="mostSupported">En Çok Desteklenen</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="verifiedOnly" 
                    checked={showOnlyVerified}
                    onChange={(e) => setShowOnlyVerified(e.target.checked)}
                    className="w-4 h-4 accent-red-500"
                  />
                  <label htmlFor="verifiedOnly" className="text-sm text-gray-600 flex items-center">
                    Sadece Aktif
                    <Check className="h-4 w-4 ml-1 text-green-500" />
                  </label>
                </div>
              </div>
            </div>
            
            {isFilterOpen && (
              <div className="mt-4 pt-4 border-t border-red-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="ghost"
                    className={activeLocation === null ? 'bg-red-100 text-red-700' : 'hover:bg-red-100 hover:text-red-700'}
                    onClick={() => setActiveLocation(null)}
                  >
                    Tüm Konumlar
                  </Button>
                  
                  {locations.map(location => (
                    <Button
                      key={location}
                      variant="ghost"
                      className={activeLocation === location ? 'bg-red-100 text-red-700' : 'hover:bg-red-100 hover:text-red-700'}
                      onClick={() => setActiveLocation(location)}
                    >
                      {location}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50" 
                    onClick={clearFilters}
                  >
                    Filtreleri Temizle
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Oyladığım protestolar butonu */}
          {address && userVotes.length > 0 && (
            <Button
              variant="ghost"
              className="mb-4 hover:bg-red-100 hover:text-red-700"
              onClick={() => setShowUserVotes(!showUserVotes)}
            >
              {showUserVotes ? "Tüm Protestoları Göster" : "Oy Verdiğim Protestolar"}
            </Button>
          )}
          
          {/* Protestolar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kullanıcının oy verdiği protestoları göster */}
            {showUserVotes 
              ? protests
                .filter(protest => userVotes.some(vote => vote.id === protest.id.toString()))
                .map(protest => (
                  <ProtestCard 
                    key={protest.id}
                    protest={protest}
                    onVoteUpdate={handleVoteUpdate}
                  />
                ))
              : visibleProtests.map(protest => (
                <ProtestCard 
                  key={protest.id}
                  protest={protest}
                  onVoteUpdate={handleVoteUpdate}
                />
              ))
            }
          </div>
          
          {/* Daha Fazla Yükle */}
          {!showUserVotes && visibleProtests.length < sortedProtests.length && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline"
                onClick={handleLoadMore}
                className="w-full max-w-md border-red-300 text-red-600 hover:bg-red-50"
              >
                Daha Fazla Yükle
              </Button>
            </div>
          )}
          
          {/* Boş Durum */}
          {visibleProtests.length === 0 && (
            <div className="text-center p-12 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">Protesto Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                Belirttiğiniz filtrelere uygun protesto bulunamadı. Lütfen filtrelerinizi değiştirip tekrar deneyin.
              </p>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={clearFilters}
              >
                Filtreleri Temizle
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

