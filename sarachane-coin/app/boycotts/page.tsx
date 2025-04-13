"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Users, Calendar, MapPin, ExternalLink, Filter, Check, AlertCircle, Wallet, ShieldAlert, Award, ChevronDown, Info } from "lucide-react"
import Link from "next/link"
import BoycottCard from "@/components/boycott-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { useBlockchain } from "../providers"
import { useRouter } from "next/navigation"
import { getBoycotts, addBoycott, updateBoycott } from "@/lib/data-service"
import { Boycott } from "@/lib/types"

// Kullanıcı oyları için tip tanımı
interface UserVote {
  id: string;
  type: "positive" | "negative";
  count: number;
  timestamp: string;
}

export default function BoycottsPage() {
  const { address, balance, connectWallet, isConnecting, sendTransaction } = useBlockchain()
  const router = useRouter()
  
  // State tanımlamaları
  const [boycotts, setBoycotts] = useState<Boycott[]>([])
  const [brandActiveTab, setBrandActiveTab] = useState("tüm-boykotlar")
  const [celebrityActiveTab, setCelebrityActiveTab] = useState("tüm-boykotlar")
  const [activeTab, setActiveTab] = useState("brands")
  const [searchTerm, setSearchTerm] = useState("")
  const [userVotes, setUserVotes] = useState<UserVote[]>([])
  const [isAddingBoycott, setIsAddingBoycott] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visibleBrandCount, setVisibleBrandCount] = useState(9)
  const [visibleCelebrityCount, setVisibleCelebrityCount] = useState(5)
  const [showUserVotes, setShowUserVotes] = useState(false)
  
  // Form durumu
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    category: "",
    description: "",
    imageFile: null as File | null
  })
  
  // Data service'ten boykotları yükle
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBoycotts();
        setBoycotts(data);
      } catch (error) {
        console.error("Boykotları yükleme hatası:", error);
        toast.error("Boykotlar yüklenirken bir hata oluştu");
      }
    }
    
    loadData();
  }, []);
  
  // LocalStorage'dan kullanıcı oylarını yükle
  useEffect(() => {
    if (address) {
      const userVotesArray: UserVote[] = [];
      // LocalStorage'daki tüm anahtarları tara
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Kullanıcının oy anahtarlarını bul
        if (key && key.startsWith('vote_') && key.includes(`_${address}`) && !key.includes('vote_protest_')) {
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
            
            // Boycott ID'sini keyden çıkar
            const idMatch = key.match(/vote_(\d+)_/);
            const boycottId = idMatch ? idMatch[1] : 'unknown';
            
            userVotesArray.push({
              id: boycottId,
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
  }, [address])
  
  // Form alanlarını güncelleme
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }
  
  // Dosya yükleme işlemi
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      // Dosya boyutu kontrolü (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Dosya boyutu 10MB'dan küçük olmalıdır")
        return
      }
      
      // Dosya tipi kontrolü
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        toast.error("Sadece JPEG, PNG veya GIF dosyaları kabul edilmektedir")
        return
      }
      
      setFormData(prev => ({ ...prev, imageFile: file }))
      toast.success("Görsel başarıyla yüklendi")
    }
  }
  
  // Boykot önerme işlemi - data-service kullanarak
  const handleSubmitBoycott = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address) {
      toast.error("Boykot önermek için cüzdanınızı bağlamalısınız")
      return
    }
    
    if (balance < 50) {
      toast.error("Boykot önermek için en az 50 Karar Coin'e sahip olmalısınız")
      return
    }
    
    const { title, target, category, description } = formData
    
    if (!title || !target || !category || !description) {
      toast.error("Lütfen tüm alanları doldurun")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Blockchain işlemi gerçekleştir - 50 Karar Coin transfer et
      const success = await sendTransaction("0xBoycottContract", 50, `Boykot önerisi: ${title}`)
      
      if (success) {
        // Eğer bir görsel yüklendiyse, base64'e dönüştür
        let imageUrl = "/placeholder.svg?height=200&width=400"
        
        if (formData.imageFile) {
          // Görseli base64'e dönüştür
          imageUrl = await convertFileToBase64(formData.imageFile)
        }
        
        // Yeni boykot oluştur
        const newBoycott = {
          title,
          target,
          category,
          startDate: new Date().toLocaleDateString('tr-TR'),
          participants: 1,
          description,
          image: imageUrl,
          positiveVotes: 0,
          negativeVotes: 0,
          status: "Onay Bekliyor" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
        }
        
        // Data service ile ekle
        const addedBoycott = await addBoycott(newBoycott);
        
        // Yeni boykotu state'e ekle
        setBoycotts(prevBoycotts => [...prevBoycotts, addedBoycott]);
        
        toast.success("Boykot öneriniz başarıyla gönderildi ve 50 Karar Coin ödendi")
        
        // Form alanlarını temizle
        setFormData({
          title: "",
          target: "",
          category: "",
          description: "",
          imageFile: null
        })
      }
    } catch (error) {
      console.error("Boykot önerme hatası:", error)
      toast.error("Boykot önerisi gönderilirken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Dosyayı Base64'e dönüştürme fonksiyonu
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }
  
  // Oy güncelleme işleyicisi
  const handleVoteUpdate = async (boycottId: number, newVotes: number, newPositiveVotes: number, newNegativeVotes: number) => {
    console.log(`Boykot oy güncellemesi: ID=${boycottId}, Toplam=${newVotes}, Pozitif=${newPositiveVotes}, Negatif=${newNegativeVotes}`);
    
    try {
      // Boykotu bul
      const boycottToUpdate = boycotts.find(b => b.id === boycottId);
      
      if (boycottToUpdate) {
        // Boykotu güncelle
        const updatedBoycott = {
          ...boycottToUpdate,
          positiveVotes: newPositiveVotes,
          negativeVotes: newNegativeVotes
        };
        
        // Data service ile güncelle
        const success = await updateBoycott(updatedBoycott);
        
        if (success) {
          // Yerel state'i güncelle
          setBoycotts(prevBoycotts => 
            prevBoycotts.map(b => 
              b.id === boycottId ? updatedBoycott : b
            )
          );
          
          console.log(`Oy güncellendi: ID=${boycottId}, Votes=${newVotes}, Positive=${newPositiveVotes}, Negative=${newNegativeVotes}`);
        }
      }
    } catch (error) {
      console.error("Oy güncelleme hatası:", error);
    }
  }

  // Marka kategorileri - İstenen kategorileri manuel olarak tanımlıyoruz
  const brandCategories = ["Tümü", "Tüketim", "Teknoloji", "Market", "Akaryakıt", "Eğlence", "Medya", "Mobilya"]
  const celebrityCategories = ["Tümü", "Oyuncular", "Müzisyenler", "Fenomenler", "Tasarımcılar", "Sporcular", "Politikacılar", "Medya Kişilikleri"]

  // Aktif filtre state'i
  const [activeBrandFilter, setActiveBrandFilter] = useState("Tümü")
  const [activeCelebrityFilter, setActiveCelebrityFilter] = useState("Tümü")

  // Boykotları kategorilere göre ayır
  const brandBoycotts = boycotts.filter(b => {
    // Ünlüler kategorisine ait olmayanları seç
    return !b.category.includes('Ünlüler') && 
      !celebrityCategories.includes(b.category) && 
      b.category !== "Oyuncular" && 
      b.category !== "Müzisyenler" && 
      b.category !== "Fenomenler" && 
      b.category !== "Tasarımcılar" && 
      b.category !== "Sporcular" && 
      b.category !== "Politikacılar" && 
      b.category !== "Medya Kişilikleri";
  });
  
  const celebrityBoycotts = boycotts.filter(b => {
    // Ünlüler kategorisine ait olanları veya alt kategorileri olanları seç
    return b.category === "Oyuncular" || 
      b.category === "Müzisyenler" || 
      b.category === "Fenomenler" || 
      b.category === "Tasarımcılar" || 
      b.category === "Sporcular" || 
      b.category === "Medya Kişilikleri" || 
      b.category.includes('Ünlüler');
  });

  // Filtrelenmiş boykotlar
  const filteredBrandBoycotts = brandBoycotts.filter((boycott) => {
    // Kategori filtresi
    const categoryMatch = activeBrandFilter === "Tümü" || boycott.category === activeBrandFilter

    // Arama filtresi
    const searchMatch =
      boycott.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boycott.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boycott.target.toLowerCase().includes(searchTerm.toLowerCase())

    return categoryMatch && searchMatch
  })

  const filteredCelebrityBoycotts = celebrityBoycotts.filter((boycott) => {
    // Kategori filtresi
    const categoryMatch = activeCelebrityFilter === "Tümü" || boycott.category === activeCelebrityFilter

    // Arama filtresi
    const searchMatch =
      boycott.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boycott.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boycott.target.toLowerCase().includes(searchTerm.toLowerCase())

    return categoryMatch && searchMatch
  })
  
  // Daha fazla göster butonu işlevleri
  const loadMoreBrands = () => {
    setVisibleBrandCount(prev => Math.min(prev + 6, filteredBrandBoycotts.length))
  }
  
  const loadMoreCelebrities = () => {
    setVisibleCelebrityCount(prev => Math.min(prev + 6, filteredCelebrityBoycotts.length))
  }
  
  // Görünür boykotların sayfalanması
  const visibleBrandBoycotts = filteredBrandBoycotts.slice(0, visibleBrandCount)
  const visibleCelebrityBoycotts = filteredCelebrityBoycotts.slice(0, visibleCelebrityCount)

  // İlgili boykotu bul
  const findBoycottById = (id: string) => {
    return boycotts.find(b => b.id.toString() === id);
  };

  // Görsel dosyasının önizlemesini oluştur
  const imagePreview = formData.imageFile ? URL.createObjectURL(formData.imageFile) : null

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">Aktif Boykotlar</h1>
          <p className="text-xl max-w-3xl animate-fadeIn animation-delay-300">
            Etik standartlar ve değerlerle uyumlu olmayan şirketlere ve kişilere karşı devam eden boykotlara katılın.
          </p>
          
          {address && (
            <div className="mt-4 inline-flex items-center bg-white/10 rounded-full px-4 py-2 text-sm">
              <Wallet className="h-4 w-4 mr-2" />
              <span className="mr-2">Karar Coin Bakiyesi:</span>
              <span className="font-bold">{balance}</span>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto py-8 px-4">
        <Tabs defaultValue="brands" className="w-full animate-fadeIn animation-delay-600" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="mb-8 w-full justify-start">
            <TabsTrigger value="brands" className="text-lg px-6 py-3 text-black">
              Markalar
            </TabsTrigger>
            <TabsTrigger value="celebrities" className="text-lg px-6 py-3 text-black">
              Ünlüler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brands">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fadeIn animation-delay-900">
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" className="flex items-center gap-2 text-black">
                  <Filter className="h-4 w-4" />
                  Filtrele
                </Button>
                {brandCategories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className={activeBrandFilter === category ? "bg-red-50 text-red-600 border-red-200" : "text-black"}
                    onClick={() => setActiveBrandFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Boykotlarda ara..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleBrandBoycotts.length > 0 ? (
                visibleBrandBoycotts.map((boycott) => (
                  <BoycottCard 
                    key={`brand-${boycott.id}`} 
                    boycott={boycott} 
                    onVoteUpdate={handleVoteUpdate}
                    hasWallet={!!address}
                  />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun boykot bulunamadı.</p>
                  <div className="mt-4">
                    <Link href="/about" className="text-red-600 hover:text-red-800 underline font-medium">
                      Karar Coin Hakkında Daha Fazla Bilgi
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {visibleBrandCount < filteredBrandBoycotts.length && (
              <div className="flex justify-center animate-fadeIn animation-delay-1200">
                <Button 
                  onClick={loadMoreBrands}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg shadow-lg transform transition-all hover:scale-105"
                >
                  Daha Fazla Yükle ({filteredBrandBoycotts.length - visibleBrandCount} kaldı)
                </Button>
              </div>
            )}
            
            <div className="flex justify-center mt-8">
              <Link href="/about" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                <Info size={18} />
                <span className="font-medium">Karar Coin hakkında daha fazla bilgi edinin</span>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="celebrities">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fadeIn animation-delay-900">
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" className="flex items-center gap-2 text-black">
                  <Filter className="h-4 w-4" />
                  Filtrele
                </Button>
                {celebrityCategories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className={activeCelebrityFilter === category ? "bg-red-50 text-red-600 border-red-200" : "text-black"}
                    onClick={() => setActiveCelebrityFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Boykotlarda ara..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleCelebrityBoycotts.length > 0 ? (
                visibleCelebrityBoycotts.map((boycott) => (
                  <BoycottCard 
                    key={`celebrity-${boycott.id}`} 
                    boycott={boycott} 
                    onVoteUpdate={handleVoteUpdate}
                    hasWallet={!!address}
                  />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun boykot bulunamadı.</p>
                  <div className="mt-4">
                    <Link href="/about" className="text-red-600 hover:text-red-800 underline font-medium">
                      Karar Coin Hakkında Daha Fazla Bilgi
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {visibleCelebrityCount < filteredCelebrityBoycotts.length && (
              <div className="flex justify-center animate-fadeIn animation-delay-1200">
                <Button 
                  onClick={loadMoreCelebrities}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg shadow-lg transform transition-all hover:scale-105"
                >
                  Daha Fazla Yükle ({filteredCelebrityBoycotts.length - visibleCelebrityCount} kaldı)
                </Button>
              </div>
            )}
            
            <div className="flex justify-center mt-8">
              <Link href="/about" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                <Info size={18} />
                <span className="font-medium">Karar Coin hakkında daha fazla bilgi edinin</span>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="bg-gray-50 py-16 animate-fadeIn animation-delay-1500">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Kendi Boykotunu Başlat</h2>
            <p className="text-xl text-gray-600">
              İnandığınız bir dava mı var? Bir boykot kampanyası başlatın ve benzer düşünen kişilerden destek toplayın.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <p className="text-amber-700 font-medium">Yeni bir boykot önermek 50 Karar Coin gerektirir</p>
            </div>
          </div>

          <form onSubmit={handleSubmitBoycott} className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Boykot Başlığı
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Net, açıklayıcı bir başlık girin"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                  Hedef Şirket/Kişi
                </label>
                <input
                  type="text"
                  id="target"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Kim boykot ediliyor?"
                  value={formData.target}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Boykotun nedenini ve neyi başarmayı umduğunuzu açıklayın"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  id="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Bir kategori seçin</option>
                  <optgroup label="Marka Kategorileri">
                    {brandCategories
                      .filter((cat) => cat !== "Tümü")
                      .map((category) => (
                        <option key={`cat-brand-${category}`} value={category}>
                          {category}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Ünlü Kategorileri">
                    {celebrityCategories
                      .filter((cat) => cat !== "Tümü")
                      .map((category) => (
                        <option key={`cat-celeb-${category}`} value={category}>
                          {category}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel Yükle (İsteğe Bağlı)</label>
                {imagePreview && (
                  <div className="mb-3">
                    <img 
                      src={imagePreview} 
                      alt="Önizleme" 
                      className="h-40 w-auto object-cover rounded-md mx-auto" 
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageFile: null }))}
                      className="mt-2 text-xs text-red-500 hover:text-red-700"
                    >
                      Görseli kaldır
                    </button>
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none"
                      >
                        <span>Dosya yükle</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file"
                          accept="image/jpeg,image/png,image/gif" 
                          className="sr-only" 
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">veya sürükle bırak</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (10MB'a kadar)</p>
                  </div>
                </div>
              </div>

              {!address ? (
                <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-md border border-yellow-200 hover:shadow-md transition-all duration-300">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Boykot önerileri yalnızca Karar Coin token sahipleri tarafından yapılabilir. Lütfen cüzdanınızı
                    bağlayın.
                  </p>
                </div>
              ) : balance < 50 ? (
                <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-md border border-yellow-200 hover:shadow-md transition-all duration-300">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Boykot önerebilmek için en az 50 Karar Coin'e sahip olmalısınız. Mevcut bakiyeniz: {balance}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-md border border-green-200 hover:shadow-md transition-all duration-300">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    Boykot önermek için yeterli bakiyeniz var. Bu işlem 50 Karar Coin'e mal olacaktır.
                  </p>
                </div>
              )}

              <Button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!address || balance < 50 || isSubmitting}
              >
                {isSubmitting ? "İşleniyor..." : "Boykot Öner (50 Karar Coin)"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}

