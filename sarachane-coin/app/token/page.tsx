"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import TokenInfo from "@/components/token-info"
import { Button } from "@/components/ui/button"
import { useBlockchain } from "@/app/providers"
import { 
  Copy, 
  CheckCircle, 
  Share2, 
  ChevronDown, 
  Wallet, 
  Send, 
  Download,
  RotateCw,
  History,
  X
} from "lucide-react"
import Image from "next/image"

export default function TokenPage() {
  const { address, balance, connectWallet, isConnecting, sendTransaction } = useBlockchain()
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [toAddress, setToAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Kopya kodu için durum
  const [isCopied, setIsCopied] = useState(false)

  // İşlem geçmişi için durum
  const [showHistory, setShowHistory] = useState(false)
  
  // Örnek işlem geçmişi
  const transactions = [
    { 
      id: "0x1234...5678", 
      type: "receive", 
      amount: 45, 
      from: "0xabcd...efgh", 
      to: address || "0x0", 
      date: "2023-04-15", 
      status: "completed" 
    },
    { 
      id: "0x8765...4321", 
      type: "send", 
      amount: 20, 
      from: address || "0x0", 
      to: "0xijkl...mnop", 
      date: "2023-04-10", 
      status: "completed" 
    },
    { 
      id: "0xabcd...efgh", 
      type: "receive", 
      amount: 100, 
      from: "0xqrst...uvwx", 
      to: address || "0x0", 
      date: "2023-04-05", 
      status: "completed" 
    }
  ]

  // Cüzdan adresini kısalt
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Cüzdan adresini kopyala
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  // Para transferi
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!toAddress || !amount) {
      alert("Lütfen alıcı adresi ve miktar girdiğinizden emin olun")
      return
    }
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Lütfen geçerli bir miktar girin")
      return
    }
    
    setIsSending(true)
    
    try {
      const success = await sendTransaction(toAddress, amountNum, memo)
      
      if (success) {
        setIsTransferModalOpen(false)
        // Form alanlarını temizle
        setToAddress("")
        setAmount("")
        setMemo("")
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">Karar Coin</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fadeIn animation-delay-300">
            Demokratik katılımı destekleyen, güçlü bir topluluk tokeni
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sol taraf - Cüzdan Kartı */}
            <div className="w-full md:w-1/3 space-y-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold">Karar Coin Cüzdanı</h3>
                    <Image 
                      src="/placeholder.svg" 
                      alt="Karar Coin Logo" 
                      width={40} 
                      height={40} 
                      className="rounded-full bg-white p-1" 
                    />
                  </div>
                  
                  {address ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <span className="text-sm font-medium">Cüzdan Adresi:</span>
                        <div className="flex items-center">
                          <span className="text-sm mr-2">{shortenAddress(address)}</span>
                          <button 
                            onClick={copyAddress} 
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Adresi kopyala"
                          >
                            {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold">{balance}</div>
                        <div className="text-sm text-white/80">Karar Coin</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Wallet className="h-12 w-12 mx-auto mb-4 opacity-70" />
                      <p className="mb-4">Bakiyenizi görmek için cüzdanınızı bağlayın</p>
                      <Button 
                        onClick={connectWallet} 
                        disabled={isConnecting} 
                        className="bg-white text-red-600 hover:bg-gray-100"
                      >
                        {isConnecting ? "Bağlanıyor..." : "Cüzdan Bağla"}
                      </Button>
                    </div>
                  )}
                </div>
                
                {address && (
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={() => setIsTransferModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Send className="h-4 w-4" />
                        <span>Gönder</span>
                      </Button>
                      <Button 
                        className="flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                        <span>Al</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {address && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-4 border-b border-gray-100">
                    <button 
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-800">İşlem Geçmişi</h3>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {showHistory && (
                    <div className="p-4 space-y-3">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                          <div className="flex justify-between">
                            <span className={`font-medium ${tx.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.type === 'receive' ? '+' : '-'}{tx.amount} KC
                            </span>
                            <span className="text-sm text-gray-500">{tx.date}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {tx.type === 'receive' ? 'Gönderen:' : 'Alıcı:'} {tx.type === 'receive' ? shortenAddress(tx.from) : shortenAddress(tx.to)}
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="ghost" className="w-full text-red-600 flex items-center justify-center gap-2 mt-2">
                        <RotateCw className="h-4 w-4" />
                        <span>Daha Fazla Yükle</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Sağ taraf - Token Bilgileri */}
            <div className="w-full md:w-2/3">
              <TokenInfo />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">Token Kullanımı</h3>
                  <p className="text-gray-600 mb-4">
                    Karar Coin, platformumuzda çeşitli eylemlerde kullanılabilen bir topluluk tokenidir:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Boykotlara oy verme (10 KC)</li>
                    <li>Yeni boykot önerme (50 KC)</li>
                    <li>Protestoları destekleme (25 KC)</li>
                    <li>Topluluk yönetimine katılma (100 KC)</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">Token Edinme</h3>
                  <p className="text-gray-600 mb-4">
                    Karar Coin'i aşağıdaki yöntemlerle edinebilirsiniz:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Platforma içerik katkısı yaparak</li>
                    <li>Diğer kullanıcılardan transfer alarak</li>
                    <li>Yerel borsalarda satın alarak</li>
                    <li>Platformda düzenlenen etkinliklere katılarak</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para Transfer Modalı */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setIsTransferModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className="text-xl font-semibold mb-6">Karar Coin Gönder</h3>
            
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alıcı Adresi</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.0"
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    KC
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Bakiyeniz: <span className="font-medium">{balance} KC</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Not (İsteğe Bağlı)</label>
                <textarea
                  placeholder="İşlem açıklaması..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isSending}
                >
                  {isSending ? <RotateCw className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                  {isSending ? "İşleniyor..." : "Gönder"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}

