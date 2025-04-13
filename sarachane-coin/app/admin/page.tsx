"use client"

import { useEffect, useState } from "react"
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  Package,
  ArrowUpRight,
  MessageSquare,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "@/components/ui/toast"
import { 
  getStats, 
  getPendingApprovals, 
  getUpcomingEvents, 
  getUserActivities,
  approveBoycott,
  rejectBoycott,
  approveProtest,
  rejectProtest
} from "@/lib/admin-service"
import { PendingApproval, EventItem, UserActivity } from "@/lib/types"

// Custom time formatting function to replace date-fns
function formatTimeAgo(timestamp: string): string {
  try {
    const currentDate = new Date();
    const targetDate = new Date(timestamp);
    
    // Calculate time difference in milliseconds
    const timeDiff = currentDate.getTime() - targetDate.getTime();
    
    // Convert to seconds, minutes, hours, days
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 30) {
      return `${Math.floor(days / 30)} ay önce`;
    } else if (days > 0) {
      return `${days} gün önce`;
    } else if (hours > 0) {
      return `${hours} saat önce`;
    } else if (minutes > 0) {
      return `${minutes} dakika önce`;
    } else {
      return `${seconds} saniye önce`;
    }
  } catch (e) {
    return "bilinmeyen zaman";
  }
}

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState("")
  const [stats, setStats] = useState({
    totalBoycotts: 0,
    totalProtests: 0,
    totalVisits: 0,
    totalTokenTransactions: 0,
    boycottChange: "0%",
    protestChange: "0%",
    visitChange: "0%",
    tokenChange: "0%"
  })
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([])
  const [loading, setLoading] = useState(true)

  // Gerçek verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // İstatistikleri yükle
        const statsData = await getStats()
        setStats(statsData)
        
        // Onay bekleyen işlemleri yükle
        const approvals = await getPendingApprovals()
        setPendingApprovals(approvals.slice(0, 3)) // İlk 3 öğeyi göster
      } catch (error) {
        console.error("Veri yükleme hatası:", error)
        toast.error("Veriler yüklenirken bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Güncel saati güncelle
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Onay bekleyen işlemleri yönet
  const handleApprove = async (item: PendingApproval) => {
    try {
      let success = false
      
      if (item.type === "Boykot") {
        success = await approveBoycott(item.id)
      } else {
        success = await approveProtest(item.id)
      }
      
      if (success) {
        // Onaylanan öğeyi listeden kaldır
        setPendingApprovals(prev => prev.filter(p => !(p.id === item.id && p.type === item.type)))
        toast.success(`${item.title} başarıyla onaylandı`)
      }
    } catch (error) {
      console.error("Onaylama hatası:", error)
      toast.error("İşlem onaylanırken bir hata oluştu")
    }
  }
  
  const handleReject = async (item: PendingApproval) => {
    try {
      let success = false
      
      if (item.type === "Boykot") {
        success = await rejectBoycott(item.id)
      } else {
        success = await rejectProtest(item.id)
      }
      
      if (success) {
        // Reddedilen öğeyi listeden kaldır
        setPendingApprovals(prev => prev.filter(p => !(p.id === item.id && p.type === item.type)))
        toast.success(`${item.title} başarıyla reddedildi`)
      }
    } catch (error) {
      console.error("Reddetme hatası:", error)
      toast.error("İşlem reddedilirken bir hata oluştu")
    }
  }
  
  // Replace the formatTime function with our custom implementation
  const formatTime = (timestamp: string) => {
    return formatTimeAgo(timestamp);
  }

  // İstatistik kartları
  const statsItems = [
    {
      title: "Toplam Boykot",
      value: stats.totalBoycotts,
      change: stats.boycottChange,
      icon: AlertTriangle,
      color: "text-orange-500 bg-orange-100",
    },
    {
      title: "Toplam Protesto",
      value: stats.totalProtests,
      change: stats.protestChange,
      icon: Users,
      color: "text-blue-500 bg-blue-100",
    },
    {
      title: "Site Ziyaretleri",
      value: stats.totalVisits,
      change: stats.visitChange,
      icon: TrendingUp,
      color: "text-green-500 bg-green-100",
    },
    {
      title: "Token İşlemi",
      value: stats.totalTokenTransactions,
      change: stats.tokenChange,
      icon: Package,
      color: "text-purple-500 bg-purple-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500">
            Hoş geldiniz, admin! Genel duruma genel bir bakış.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-2xl font-semibold text-gray-800">{currentTime}</p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString("tr-TR")}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-2">son 30 günde</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Graph Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Site Analitikleri</CardTitle>
          <CardDescription>Son 30 gündeki aktivite verileri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {/* Placeholder for analytics chart */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Analitik grafikleri burada görüntülenecek</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* Onay Bekleyen İşlemler */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Onay Bekleyen İşlemler</CardTitle>
            <CardDescription>Yönetici onayı gerektiren işlemler</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
              </div>
            ) : pendingApprovals.length > 0 ? (
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className={`rounded-full p-2 ${
                      item.type === "Boykot" 
                        ? "bg-orange-100 text-orange-500" 
                        : "bg-blue-100 text-blue-500"
                    }`}>
                      {item.type === "Boykot" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{item.requester}</span>
                        <span className="mx-1">•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleApprove(item)}
                      >
                        Onayla
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleReject(item)}
                      >
                        Reddet
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Link href={"/admin/approvals"}>
                    <Button variant="outline" className="w-full">
                      Tüm Bekleyen İşlemleri Görüntüle
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-500">Onay bekleyen işlem bulunmamaktadır</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 