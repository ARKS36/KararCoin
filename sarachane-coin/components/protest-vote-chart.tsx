"use client"

import { useEffect, useRef } from "react"

interface ProtestVoteChartProps {
  positiveVotes: number
  negativeVotes: number
  positivePercentage?: number
  negativePercentage?: number
}

export default function ProtestVoteChart({ 
  positiveVotes, 
  negativeVotes, 
  positivePercentage: propPositivePercentage, 
  negativePercentage: propNegativePercentage 
}: ProtestVoteChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const totalVotes = positiveVotes + negativeVotes
    
    // Eğer yüzde değerleri props olarak geldiyse, onları kullan
    // Aksi takdirde hesapla (0 bölme hatası kontrolü)
    const positivePercentage = propPositivePercentage !== undefined
      ? propPositivePercentage / 100
      : totalVotes > 0 ? positiveVotes / totalVotes : 0
      
    const negativePercentage = propNegativePercentage !== undefined
      ? propNegativePercentage / 100
      : totalVotes > 0 ? negativeVotes / totalVotes : 0

    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Arka plan çubuğu (koyu tema için)
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Pozitif (yeşil) ve negatif (kırmızı) bölgeleri ayrı ayrı çiz
    // Pozitif (yeşil) bölge 
    const positiveWidth = canvas.width * positivePercentage
    if (positiveVotes > 0) {
      const greenGradient = ctx.createLinearGradient(0, 0, positiveWidth, 0)
      greenGradient.addColorStop(0, "#059669") // yeşil-600
      greenGradient.addColorStop(1, "#10b981") // yeşil-500
      ctx.fillStyle = greenGradient
      ctx.fillRect(0, 0, positiveWidth, canvas.height)
    }
    
    // Negatif (kırmızı) bölge
    if (negativeVotes > 0) {
      const redGradient = ctx.createLinearGradient(positiveWidth, 0, canvas.width, 0)
      redGradient.addColorStop(0, "#dc2626") // kırmızı-600
      redGradient.addColorStop(1, "#ef4444") // kırmızı-500
      ctx.fillStyle = redGradient
      ctx.fillRect(positiveWidth, 0, canvas.width - positiveWidth, canvas.height)
    }

    // Eğer çok az oy varsa minimum gösterim için
    if (positiveVotes > 0 && positivePercentage < 0.02) {
      ctx.fillStyle = "#059669" // yeşil-600
      ctx.fillRect(0, 0, canvas.width * 0.02, canvas.height)
    }

    if (negativeVotes > 0 && negativePercentage < 0.02) {
      ctx.fillStyle = "#dc2626" // kırmızı-600
      ctx.fillRect(canvas.width * 0.98, 0, canvas.width * 0.02, canvas.height)
    }
    
    // Oyların eşit olduğu durumda ara çizgi ekle
    if (Math.abs(positivePercentage - 0.5) < 0.01 && totalVotes > 0) {
      ctx.fillStyle = "#475569" // slate-600
      ctx.fillRect(canvas.width * 0.495, 0, canvas.width * 0.01, canvas.height)
    }
  }, [positiveVotes, negativeVotes, propPositivePercentage, propNegativePercentage])

  // Yüzdeleri hesapla - toplam oy 0 ise 0 olarak belirle
  const totalVotes = positiveVotes + negativeVotes
  const calcPositivePercentage = propPositivePercentage || (totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0)
  const calcNegativePercentage = propNegativePercentage || (totalVotes > 0 ? Math.round((negativeVotes / totalVotes) * 100) : 0)

  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={8} 
        className="w-full h-2 rounded-full shadow-sm"
        aria-label={`Oy oranı: %${calcPositivePercentage} destekleme, %${calcNegativePercentage} desteklememe`}
      />
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>Destekliyorum ({positiveVotes})</span>
        <span>Desteklemiyorum ({negativeVotes})</span>
      </div>
    </div>
  )
} 