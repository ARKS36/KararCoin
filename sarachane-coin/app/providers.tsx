"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { toast } from "@/components/ui/toast"

// Admin kimlik doğrulama için context tipi
interface AuthContextType {
  isAdmin: boolean
  adminLogin: (username: string, password: string) => Promise<boolean>
  adminLogout: () => void
}

// Admin context oluşturuldu
const AuthContext = createContext<AuthContextType | null>(null)

// Admin context hook'u
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface BlockchainContextType {
  address: string | null
  balance: number
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  sendTransaction: (to: string, amount: number, memo?: string) => Promise<boolean>
  multiVote: (contractAddress: string, amount: number, times: number, memo?: string) => Promise<boolean>
}

const BlockchainContext = createContext<BlockchainContextType | null>(null)

export const useBlockchain = () => {
  const context = useContext(BlockchainContext)
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider")
  }
  return context
}

// Admin yetkilendirme sağlayıcısı
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  // LocalStorage'dan admin durumunu kontrol et
  useEffect(() => {
    const adminStatus = localStorage.getItem("adminAuthenticated")
    if (adminStatus === "true") {
      setIsAdmin(true)
    }
  }, [])

  // Admin girişi
  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    // Basit bir admin doğrulama - gerçek projede güvenli bir kimlik doğrulama kullanılmalıdır
    if (username === "admin" && password === "KararCoin2024") {
      setIsAdmin(true)
      localStorage.setItem("adminAuthenticated", "true")
      toast.success("Admin girişi başarılı")
      return true
    } else {
      toast.error("Geçersiz kullanıcı adı veya şifre")
      return false
    }
  }

  // Admin çıkışı
  const adminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem("adminAuthenticated")
    toast.info("Admin çıkışı yapıldı")
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

  // LocalStorage'dan wallet bilgisini oku
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress")
    if (savedAddress) {
      setAddress(savedAddress)
      // Bakiye bilgisini getir
      const savedBalance = localStorage.getItem("walletBalance")
      setBalance(savedBalance ? parseInt(savedBalance) : Math.floor(Math.random() * 1000) + 50)
    }
  }, [])

  // Bakiye değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (address) {
      localStorage.setItem("walletBalance", balance.toString())
    }
  }, [balance, address])

  // Simüle edilmiş Web3 cüzdan varlık kontrolü
  const isWeb3Available = () => {
    // Gerçek bir Web3 uygulamasında: return typeof window !== 'undefined' && window.ethereum !== undefined
    // Simülasyon amacıyla her zaman true döndürüyoruz
    return true
  }

  // Cüzdan bağlama
  const connectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true)
      
      // Simüle edilmiş web3 bağlantı kontrolü
      if (!isWeb3Available()) {
        toast.error("Web3 cüzdan bulunamadı. Lütfen MetaMask veya başka bir Web3 cüzdan yükleyin.")
        return
      }
      
      // Web3 bağlantı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Gerçek bir uygulamada: const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      // Simülasyon için rastgele bir adres oluşturma
      const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
      const mockBalance = Math.floor(Math.random() * 1000) + 50

      setAddress(mockAddress)
      setBalance(mockBalance)
      localStorage.setItem("walletAddress", mockAddress)
      localStorage.setItem("walletBalance", mockBalance.toString())

      toast.success("Cüzdan bağlantısı başarılı")
    } catch (error) {
      console.error("Cüzdan bağlantı hatası:", error)
      toast.error("Cüzdan bağlantısında bir hata oluştu")
    } finally {
      setIsConnecting(false)
    }
  }

  // Cüzdan bağlantısını kesme
  const disconnectWallet = () => {
    setAddress(null)
    setBalance(0)
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletBalance")
    toast.info("Cüzdan bağlantısı kesildi")
  }

  // İşlem gönderme
  const sendTransaction = async (to: string, amount: number, memo?: string): Promise<boolean> => {
    if (!address) {
      toast.error("İşlem yapmak için cüzdanınızı bağlamalısınız")
      return false
    }

    if (balance < amount) {
      toast.error(`İşlem için yeterli bakiyeniz yok. Mevcut bakiye: ${balance} Karar Coin`)
      return false
    }

    try {
      // Blockchain'e işlem gönderme işlemi simüle ediliyor
      await new Promise(resolve => setTimeout(resolve, 1500))

      // İşlem başarılıysa bakiyeyi güncelle
      setBalance(prev => prev - amount)

      toast.success(`${amount} Karar Coin gönderildi`)
      return true
    } catch (error) {
      console.error("İşlem hatası:", error)
      toast.error("İşlem sırasında bir hata oluştu")
      return false
    }
  }
  
  // Birden fazla oy verme - çoklu işlem
  const multiVote = async (contractAddress: string, amount: number, times: number, memo?: string): Promise<boolean> => {
    if (!address) {
      toast.error("İşlem yapmak için cüzdanınızı bağlamalısınız")
      return false
    }
    
    const totalAmount = amount * times
    
    if (balance < totalAmount) {
      toast.error(`İşlem için yeterli bakiyeniz yok. Mevcut bakiye: ${balance} Karar Coin, Gereken: ${totalAmount} Karar Coin`)
      return false
    }
    
    try {
      // Çoklu işlem simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500 + (times * 300)))
      
      // İşlem başarılıysa bakiyeyi güncelle
      setBalance(prev => prev - totalAmount)
      
      toast.success(`${times} kez oy kullanıldı, toplam ${totalAmount} Karar Coin harcandı`)
      return true
    } catch (error) {
      console.error("Çoklu işlem hatası:", error)
      toast.error("İşlem sırasında bir hata oluştu")
      return false
    }
  }

  return (
    <BlockchainContext.Provider
      value={{
        address,
        balance,
        isConnecting,
        connectWallet,
        disconnectWallet,
        sendTransaction,
        multiVote
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
} 