"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { 
  Search, 
  AlertTriangle, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { getPendingApprovals, approveBoycott, approveProtest, rejectBoycott, rejectProtest } from "@/lib/admin-service"
import { PendingApproval } from "@/lib/types"

export default function ApprovalsPage() {
  const [pendingItems, setPendingItems] = useState<PendingApproval[]>([])
  const [filteredItems, setFilteredItems] = useState<PendingApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"Tümü" | "Boykot" | "Protesto">("Tümü")
  const [selectedItem, setSelectedItem] = useState<PendingApproval | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"onay" | "red" | null>(null)

  // Verileri yükle
  useEffect(() => {
    loadPendingItems()
  }, [])
  
  // Filtrelenmiş verileri hesapla
  useEffect(() => {
    let filtered = [...pendingItems]
    
    // Arama terimini uygula
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.requester.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Tip filtresini uygula
    if (typeFilter !== "Tümü") {
      filtered = filtered.filter(item => item.type === typeFilter)
    }
    
    setFilteredItems(filtered)
  }, [pendingItems, searchTerm, typeFilter])

  // Bekleyen onayları yükle
  const loadPendingItems = async () => {
    try {
      setLoading(true)
      const items = await getPendingApprovals()
      setPendingItems(items)
      setFilteredItems(items)
    } catch (error) {
      console.error("Onay bekleyen öğeler yüklenirken hata:", error)
      toast.error("Onay bekleyen öğeler yüklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  // Onaylama diyaloğunu aç
  const openConfirmDialog = (item: PendingApproval, action: "onay" | "red") => {
    setSelectedItem(item)
    setConfirmAction(action)
    setConfirmDialogOpen(true)
  }

  // Onaylama işlemini gerçekleştir
  const handleConfirm = async () => {
    if (!selectedItem || !confirmAction) return
    
    try {
      let success = false
      
      if (confirmAction === "onay") {
        if (selectedItem.type === "Boykot") {
          success = await approveBoycott(selectedItem.id)
        } else {
          success = await approveProtest(selectedItem.id)
        }
        
        if (success) {
          toast.success(`${selectedItem.title} başarıyla onaylandı`)
        }
      } else {
        if (selectedItem.type === "Boykot") {
          success = await rejectBoycott(selectedItem.id)
        } else {
          success = await rejectProtest(selectedItem.id)
        }
        
        if (success) {
          toast.success(`${selectedItem.title} başarıyla reddedildi`)
        }
      }
      
      if (success) {
        // Öğeyi listeden kaldır
        setPendingItems(prev => prev.filter(item => 
          !(item.id === selectedItem.id && item.type === selectedItem.type)
        ))
      } else {
        toast.error("İşlem gerçekleştirilemedi")
      }
    } catch (error) {
      console.error("İşlem hatası:", error)
      toast.error("İşlem gerçekleştirilemedi")
    } finally {
      setConfirmDialogOpen(false)
      setSelectedItem(null)
      setConfirmAction(null)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Onay Bekleyen İşlemler</h1>
          <p className="text-gray-500">Onay bekleyen tüm boykot ve protestoları yönetin</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="flex items-center gap-1"
            onClick={loadPendingItems}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Yenile</span>
          </Button>
        </div>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Onay Listesi</CardTitle>
          <CardDescription>Kullanıcılar tarafından önerilen ve onay bekleyen işlemler</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filtreler */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Arama */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-full bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Tip Filtresi */}
            <div className="md:w-1/4">
              <div className="relative">
                <select
                  className="w-full bg-white appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "Tümü" | "Boykot" | "Protesto")}
                >
                  <option value="Tümü">Tüm Tipler</option>
                  <option value="Boykot">Boykotlar</option>
                  <option value="Protesto">Protestolar</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
          
          {/* Onay bekleyen öğeler listesi */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div 
                  key={`${item.type}-${item.id}`} 
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${
                      item.type === "Boykot" 
                        ? "bg-orange-100 text-orange-500" 
                        : "bg-blue-100 text-blue-500"
                    }`}>
                      {item.type === "Boykot" ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Users className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          item.type === "Boykot" 
                            ? "bg-orange-100 text-orange-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>Oluşturan: {item.requester}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-auto">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => openConfirmDialog(item, "onay")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Onayla
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => openConfirmDialog(item, "red")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reddet
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Onay Bekleyen İşlem Bulunmuyor</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Şu anda onay bekleyen boykot veya protesto bulunmuyor. Yeni işlemler geldiğinde burada listelenecektir.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Onay/Red diyaloğu */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "onay" ? "İşlemi Onayla" : "İşlemi Reddet"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "onay"
                ? "Bu işlemi onaylamak istediğinizden emin misiniz? Onaylandıktan sonra bu işlem aktif olarak görüntülenecektir."
                : "Bu işlemi reddetmek istediğinizden emin misiniz? Reddedilen işlemler kullanıcılara gösterilmeyecektir."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="py-3">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{selectedItem.title}</h4>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  selectedItem.type === "Boykot" 
                    ? "bg-orange-100 text-orange-700" 
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {selectedItem.type}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Oluşturan: {selectedItem.requester} • Tarih: {selectedItem.date}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              İptal
            </Button>
            <Button 
              onClick={handleConfirm}
              className={confirmAction === "onay" 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white"}
            >
              {confirmAction === "onay" ? "Onayla" : "Reddet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 