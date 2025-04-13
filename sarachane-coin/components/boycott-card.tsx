"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { Boycott } from "@/lib/types"
import {
  Users,
  Calendar,
  Target,
  ThumbsUp,
  ThumbsDown,
  BadgeCheck,
  Clock,
  XCircle,
} from "lucide-react"
import BoycottVoteChart from "./boycott-vote-chart"
import { useBlockchain } from "@/app/providers"

interface BoycottCardProps {
  boycott: Boycott
  onVoteUpdate?: (id: number, votes: number, positiveVotes: number, negativeVotes: number) => void
  hasWallet?: boolean
}

export default function BoycottCard({ boycott, onVoteUpdate, hasWallet = false }: BoycottCardProps) {
  const { id, title, target, category, startDate, participants, description, positiveVotes, negativeVotes, status, image } = boycott
  
  const { address, balance, sendTransaction, isConnecting, multiVote } = useBlockchain()
  const [voted, setVoted] = useState<string | null>(null)
  const [voteCount, setVoteCount] = useState(1)
  const [localPositiveVotes, setLocalPositiveVotes] = useState(positiveVotes)
  const [localNegativeVotes, setLocalNegativeVotes] = useState(negativeVotes)
  const [isVerified, setIsVerified] = useState(status === "Aktif")
  
  const totalVotes = localPositiveVotes + localNegativeVotes
  const positivePercentage = totalVotes > 0 ? Math.round((localPositiveVotes / totalVotes) * 100) : 0
  const negativePercentage = totalVotes > 0 ? 100 - positivePercentage : 0

  // Kullanıcının bu boykota oy verip vermediğini kontrol et
  useEffect(() => {
    if (address) {
      const voteKey = `vote_${id}_${address}`
      const voteData = localStorage.getItem(voteKey)
      
      if (voteData) {
        try {
          const parsed = JSON.parse(voteData)
          setVoted(parsed.type)
          setVoteCount(parsed.count || 1)
        } catch {
          // Eski format
          setVoted(voteData)
          setVoteCount(1)
        }
      }
    }
  }, [id, address])

  // Oy verme işlemi
  const handleVote = async (voteType: "positive" | "negative") => {
    if (!address) {
      toast.error("Oy verebilmek için cüzdanınızı bağlamalısınız")
      return
    }
    
    if (balance < 10) {
      toast.error("Oy vermek için en az 10 Karar Coin'e ihtiyacınız var")
      return
    }
    
    // Eğer kullanıcı aynı oy tipini tekrar seçerse (değişiklik yapmak istemiyor)
    if (voted === voteType) {
      toast.info("Zaten bu şekilde oy kullanmışsınız")
      return
    }
    
    // Blockchain işlemi
    const success = await sendTransaction(
      "0xVoteContract", 
      10, 
      `Boykot oyu: ${title} - ${voteType === "positive" ? "Destekliyorum" : "Desteklemiyorum"}`
    )
    
    if (!success) {
      toast.error("Oy işlemi gerçekleştirilemedi")
      return
    }
    
    // Yeni oy sayılarını hesapla
    let newPositiveVotes = localPositiveVotes
    let newNegativeVotes = localNegativeVotes
    
    // Eğer daha önce oy kullandıysa, eski oyu çıkar
    if (voted !== null) {
      if (voted === "positive") {
        newPositiveVotes -= 1
      } else {
        newNegativeVotes -= 1
      }
    }
    
    // Yeni oyu ekle
    if (voteType === "positive") {
      newPositiveVotes += 1
    } else {
      newNegativeVotes += 1
    }
    
    // State'i güncelle
    setLocalPositiveVotes(newPositiveVotes)
    setLocalNegativeVotes(newNegativeVotes)
    setVoted(voteType)
    setVoteCount(1)
    
    // Oy verisini kaydet
    const voteKey = `vote_${id}_${address}`
    const voteData = {
      type: voteType,
      count: 1,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem(voteKey, JSON.stringify(voteData))
    
    // Callback'i çağır
    if (onVoteUpdate) {
      const totalVotes = newPositiveVotes + newNegativeVotes
      onVoteUpdate(id, totalVotes, newPositiveVotes, newNegativeVotes)
    }
    
    const message = voted !== null 
      ? `Oyunuz değiştirildi: ${voteType === "positive" ? "Destekliyorum" : "Desteklemiyorum"}`
      : `Oyunuz kaydedildi: ${voteType === "positive" ? "Destekliyorum" : "Desteklemiyorum"}`
    
    toast.success(message)
  }

  // Çoklu oy verme işlemi
  const handleMultiVote = async (voteType: "positive" | "negative", amount: number) => {
    if (!address) {
      toast.error("Oy verebilmek için cüzdanınızı bağlamalısınız")
      return
    }
    
    const requiredBalance = amount * 10 // Her oy 10 Karar Coin
    
    if (balance < requiredBalance) {
      toast.error(`${amount} oy vermek için en az ${requiredBalance} Karar Coin'e ihtiyacınız var`)
      return
    }
    
    // multiVote fonksiyonunu kullan
    const success = await multiVote(
      "0xVoteContract",
      10, // Her oy 10 Karar Coin
      amount, // Kaç kez oy kullanılacak
      `Boykot çoklu oyu: ${title} - ${voteType === "positive" ? "Destekliyorum" : "Desteklemiyorum"} (${amount} oy)`
    )
    
    if (!success) {
      toast.error("Çoklu oy işlemi gerçekleştirilemedi")
      return
    }
    
    // Yeni oy sayılarını hesapla
    let newPositiveVotes = localPositiveVotes
    let newNegativeVotes = localNegativeVotes
    
    if (voted) {
      // Önceki oy hesabını güncelle
      if (voted === "positive") {
        newPositiveVotes -= voteCount
      } else {
        newNegativeVotes -= voteCount
      }
    }
    
    // Yeni oyları ekle
    if (voteType === "positive") {
      newPositiveVotes += amount
    } else {
      newNegativeVotes += amount
    }
    
    // State'i güncelle
    setLocalPositiveVotes(newPositiveVotes)
    setLocalNegativeVotes(newNegativeVotes)
    setVoted(voteType)
    setVoteCount(amount)
    
    // Oy verisini kaydet
    const voteKey = `vote_${id}_${address}`
    const voteData = {
      type: voteType,
      count: amount,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem(voteKey, JSON.stringify(voteData))
    
    // Callback'i çağır
    if (onVoteUpdate) {
      const totalVotes = newPositiveVotes + newNegativeVotes
      onVoteUpdate(id, totalVotes, newPositiveVotes, newNegativeVotes)
    }
    
    toast.success(`${amount} oyunuz kaydedildi: ${voteType === "positive" ? "Destekliyorum" : "Desteklemiyorum"}`)
  }

  return (
    <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border-gray-200">
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <img
          src={image || "/placeholder.svg?height=300&width=500"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {status === "Aktif" && (
            <span className="flex items-center bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              <BadgeCheck className="h-3 w-3 mr-1" />
              <span>Onaylı</span>
            </span>
          )}
          {status === "Onay Bekliyor" && (
            <span className="flex items-center bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              <span>Beklemede</span>
            </span>
          )}
          {status === "Reddedildi" && (
            <span className="flex items-center bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              <XCircle className="h-3 w-3 mr-1" />
              <span>Reddedildi</span>
            </span>
          )}
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="mb-2">
          <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full">{category}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Target className="h-4 w-4 mr-2 text-red-500" />
            <span>{target}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-red-500" />
            <span>{startDate}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-red-500" />
            <span><span className="font-bold">{participants.toLocaleString('tr-TR')}</span> katılımcı</span>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-gray-700 text-sm line-clamp-3">
            {description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 pb-5 pt-0 flex flex-col">
        <div className="mb-4 w-full">
          <BoycottVoteChart 
            positiveVotes={localPositiveVotes}
            negativeVotes={localNegativeVotes}
          />
        </div>
        
        <div className="flex justify-between gap-2 w-full">
          <Button
            className={`flex-1 ${voted === "positive" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-700"}`}
            disabled={isConnecting}
            onClick={() => handleVote("positive")}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Destekliyorum
          </Button>
          
          <Button
            className={`flex-1 ${voted === "negative" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-700"}`}
            disabled={isConnecting}
            onClick={() => handleVote("negative")}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Desteklemiyorum
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 