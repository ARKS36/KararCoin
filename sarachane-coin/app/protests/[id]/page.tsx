"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowLeft, MapPin, Calendar, Users, ThumbsUp, Share2, Flag, Wallet } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/toast"

// Next.js 15 ile uyumlu tip tanımları
type Props = {
  params: {
    id: string
  }
}

export default function ProtestDetailPage({ params }: Props) {
  const { addToast } = useToast()
  const [isSupported, setIsSupported] = useState(false)
  const [votes, setVotes] = useState(1245)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  
  // This would normally come from an API or database
  const protest = {
    id: Number.parseInt(params.id),
    title: "University Tuition Protest",
    location: "Istanbul",
    date: "2023-05-15",
    participants: 2500,
    description:
      "Students protesting against rising tuition fees at major universities across Istanbul. The protest began at Taksim Square and proceeded to the Ministry of Education offices. Participants are demanding a freeze on tuition increases and more transparent financial aid processes.",
    longDescription:
      "The protest was organized by the Student Union Coalition, representing students from 12 major universities in Istanbul. Rising tuition costs have increased by an average of 40% over the past two years, while scholarship and financial aid opportunities have remained stagnant.\n\nStudents are demanding:\n- A freeze on tuition increases for the next 3 academic years\n- Expansion of scholarship programs\n- More transparent financial aid application processes\n- Student representation in university budget decisions\n\nThe protest remained peaceful throughout, with speakers from various universities addressing the crowd. University administrators have agreed to meet with student representatives next week to discuss their concerns.",
    imageUrl: "/placeholder.svg?height=400&width=800",
    votes: votes,
    updates: [
      {
        date: "2023-05-16",
        content: "University administrators have agreed to meet with student representatives next week.",
      },
      {
        date: "2023-05-18",
        content: "The Ministry of Education has issued a statement acknowledging student concerns.",
      },
    ],
  }
  
  // Support butonu işlevi
  const handleSupport = () => {
    if (!isSupported) {
      setVotes(votes + 1)
      setIsSupported(true)
      addToast("Bu protestoyu desteklediniz!", "success")
    } else {
      addToast("Bu protestoyu zaten desteklediniz!", "error")
    }
  }
  
  // Paylaşma işlevi
  const handleShare = () => {
    const shareUrl = window.location.href
    // Tarayıcı paylaşım API'sini destekliyorsa kullan
    if (navigator.share) {
      navigator.share({
        title: protest.title,
        text: protest.description,
        url: shareUrl,
      })
      .then(() => console.log('Paylaşım başarılı'))
      .catch((error) => console.log('Paylaşım hatası:', error))
    } else {
      // Clipboard API'sini kullanarak URL'yi kopyala
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          addToast("Bağlantı panoya kopyalandı!", "success")
        })
        .catch(() => {
          addToast("Kopyalama başarısız oldu!", "error")
        })
    }
  }
  
  // Raporlama işlevi
  const handleReport = () => {
    addToast("Raporunuz alındı. Ekibimiz inceleyecek.", "success")
  }
  
  // Cüzdan bağlantısı işlevi
  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsWalletConnected(true)
          addToast("Cüzdan bağlantısı başarılı!", "success")
        }
      } else {
        addToast("Metamask veya web3 cüzdan bulunamadı!", "error")
      }
    } catch (error) {
      console.error("Bağlantı hatası:", error)
      addToast("Cüzdan bağlanırken bir hata oluştu!", "error")
    } finally {
      setIsConnecting(false)
    }
  }
  
  // Bağış işlevi
  const handleDonate = (amount: number) => {
    if (!isWalletConnected) {
      addToast("Önce cüzdanınızı bağlamalısınız!", "error")
      return
    }
    
    setSelectedDonation(amount)
    // Gerçek uygulamada burada blok zinciri işlemi yapılır
    setTimeout(() => {
      addToast(`${amount} token başarıyla bağışlandı!`, "success")
      setSelectedDonation(null)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/protests" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tüm protestolara dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
              <img
                src={protest.imageUrl || "/placeholder.svg"}
                alt={protest.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{protest.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <MapPin className="h-4 w-4 mr-1 text-red-500" />
                {protest.location}
              </div>
              <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4 mr-1 text-red-500" />
                {protest.date}
              </div>
              <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 mr-1 text-red-500" />
                {protest.participants.toLocaleString()} katılımcı
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700 mb-4">{protest.description}</p>
              <p className="text-gray-700 whitespace-pre-line">{protest.longDescription}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Son Güncellemeler</h2>
              {protest.updates.map((update, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">{update.date}</p>
                  <p className="text-gray-700">{update.content}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button 
                className={`${isSupported ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                onClick={handleSupport}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {isSupported ? 'Desteklendi' : 'Destekle'} ({protest.votes})
              </Button>
              <Button 
                variant="outline" 
                className="text-gray-700"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Paylaş
              </Button>
              <Button 
                variant="outline" 
                className="text-gray-700"
                onClick={handleReport}
              >
                <Flag className="h-4 w-4 mr-2" />
                Bildir
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Saraçhane Coin ile Destekle</h3>
              <p className="text-gray-600 mb-6">
                Katkınız bu hareketin görünürlük ve kaynak kazanmasına yardımcı olur. Tüm bağışlar blok zincirinde şeffaftır.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">10 Token</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`text-red-600 border-red-200 hover:bg-red-50 ${selectedDonation === 10 ? 'bg-red-50' : ''}`}
                    onClick={() => handleDonate(10)}
                    disabled={!isWalletConnected || isConnecting || selectedDonation !== null}
                  >
                    {selectedDonation === 10 ? 'İşleniyor...' : 'Bağışla'}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">50 Token</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`text-red-600 border-red-200 hover:bg-red-50 ${selectedDonation === 50 ? 'bg-red-50' : ''}`}
                    onClick={() => handleDonate(50)}
                    disabled={!isWalletConnected || isConnecting || selectedDonation !== null}
                  >
                    {selectedDonation === 50 ? 'İşleniyor...' : 'Bağışla'}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">100 Token</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`text-red-600 border-red-200 hover:bg-red-50 ${selectedDonation === 100 ? 'bg-red-50' : ''}`}
                    onClick={() => handleDonate(100)}
                    disabled={!isWalletConnected || isConnecting || selectedDonation !== null}
                  >
                    {selectedDonation === 100 ? 'İşleniyor...' : 'Bağışla'}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Özel Miktar</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`text-red-600 border-red-200 hover:bg-red-50 ${selectedDonation === -1 ? 'bg-red-50' : ''}`}
                    onClick={() => {
                      const amount = prompt("Bağışlamak istediğiniz token miktarını girin:")
                      if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                        handleDonate(Number(amount))
                      } else if (amount !== null) {
                        addToast("Lütfen geçerli bir sayı girin!", "error")
                      }
                    }}
                    disabled={!isWalletConnected || isConnecting || selectedDonation !== null}
                  >
                    {selectedDonation === -1 ? 'İşleniyor...' : 'Bağışla'}
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                onClick={connectWallet}
                disabled={isWalletConnected || isConnecting}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting 
                  ? "Bağlanıyor..." 
                  : isWalletConnected 
                    ? `Bağlandı: ${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}` 
                    : "Cüzdanını Bağla"}
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">İlgili Protestolar</h3>
              <div className="space-y-4">
                <Link href="/protests/2" className="block group">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src="/placeholder.svg?height=64&width=64"
                        alt="Related Protest"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                        Çevre Koruma Mitingi
                      </h4>
                      <p className="text-sm text-gray-500">Ankara • 1,800 katılımcı</p>
                    </div>
                  </div>
                </Link>
                <Link href="/protests/3" className="block group">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src="/placeholder.svg?height=64&width=64"
                        alt="Related Protest"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                        Workers' Rights March
                      </h4>
                      <p className="text-sm text-gray-500">Izmir • 3,200 participants</p>
                    </div>
                  </div>
                </Link>
                <Link href="/protests/4" className="block group">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src="/placeholder.svg?height=64&width=64"
                        alt="Related Protest"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                        Media Freedom Demonstration
                      </h4>
                      <p className="text-sm text-gray-500">Istanbul • 1,500 participants</p>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

