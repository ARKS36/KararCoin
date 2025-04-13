"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  PlusCircle,
  Search,
  RefreshCcw,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { toast } from "@/components/ui/toast"
import { Boycott } from "@/lib/types"
import { 
  getBoycotts, 
  deleteBoycott, 
  approveBoycott, 
  rejectBoycott,
  updateBoycott,
  addBoycott
} from "@/lib/data-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog"

// Kategori listesi
const categories = [
  "Tümü",
  "Tüketim",
  "Teknoloji",
  "Market",
  "Akaryakıt",
  "Eğlence",
  "Medya",
  "Mobilya",
  "Oyuncular",
  "Müzisyenler",
  "Fenomenler",
  "Tasarımcılar",
  "Sporcular", 
  "Politikacılar",
  "Medya Kişilikleri"
]

// Durum listesi
const statuses = ["Tümü", "Aktif", "Onay Bekliyor", "Reddedildi", "Sona Erdi"]

// Kategori tipini belirle (Marka veya Ünlü)
const getCategoryType = (category: string): "Marka" | "Ünlü" | "" => {
  const brandCategories = ["Tüketim", "Teknoloji", "Market", "Akaryakıt", "Eğlence", "Medya", "Mobilya"];
  const celebrityCategories = ["Oyuncular", "Müzisyenler", "Fenomenler", "Tasarımcılar", "Sporcular", "Politikacılar", "Medya Kişilikleri"];
  
  if (brandCategories.includes(category)) return "Marka";
  if (celebrityCategories.includes(category)) return "Ünlü";
  return "";
}

export default function AdminBoycottsPage() {
  const [boycotts, setBoycotts] = useState<Boycott[]>([])
  const [filteredBoycotts, setFilteredBoycotts] = useState<Boycott[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [selectedStatus, setSelectedStatus] = useState("Tümü")
  const [sortBy, setSortBy] = useState("participants")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedBoycott, setSelectedBoycott] = useState<Boycott | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    target: string;
    category: string;
    startDate: string;
    participants: number;
    positiveVotes: number;
    negativeVotes: number;
    image?: string;
  }>({
    title: "",
    description: "",
    target: "",
    category: "Tüketim",
    startDate: "",
    participants: 0,
    positiveVotes: 0,
    negativeVotes: 0,
    image: ""
  })
  
  // Boykotları yükle
  useEffect(() => {
    loadBoycotts()
  }, [])
  
  const loadBoycotts = async () => {
    try {
      setLoading(true)
      const data = await getBoycotts()
      setBoycotts(data)
      setFilteredBoycotts(data)
    } catch (error) {
      console.error("Boykotları yükleme hatası:", error)
      toast.error("Boykotlar yüklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }
  
  // Filtrelenmiş boykotları güncelle
  useEffect(() => {
    if (boycotts.length === 0) return
    
    let filtered = boycotts.filter(boycott => {
      // Arama filtresi
      const searchMatch = 
        boycott.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        boycott.target.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Kategori filtresi
      const categoryMatch = selectedCategory === "Tümü" || boycott.category === selectedCategory
      
      // Durum filtresi
      const statusMatch = selectedStatus === "Tümü" || boycott.status === selectedStatus
      
      return searchMatch && categoryMatch && statusMatch
    })
    
    // Sıralama
    filtered.sort((a, b) => {
      if (sortBy === "participants") {
        return sortOrder === "desc" ? b.participants - a.participants : a.participants - b.participants
      } else if (sortBy === "votes") {
        // Toplam oy sayısı
        const votesA = a.positiveVotes + a.negativeVotes;
        const votesB = b.positiveVotes + b.negativeVotes;
        return sortOrder === "desc" ? votesB - votesA : votesA - votesB;
      } else if (sortBy === "date") {
        // Tarih formatı: DD.MM.YYYY
        const dateA = new Date(a.startDate.split('.').reverse().join('-'))
        const dateB = new Date(b.startDate.split('.').reverse().join('-'))
        return sortOrder === "desc" 
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime()
      } else if (sortBy === "title") {
        return sortOrder === "desc"
          ? b.title.localeCompare(a.title, 'tr')
          : a.title.localeCompare(b.title, 'tr')
      }
      // Varsayılan: ID'ye göre sırala
      return sortOrder === "desc" ? b.id - a.id : a.id - b.id
    })
    
    setFilteredBoycotts(filtered)
  }, [boycotts, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder])
  
  // Sıralama işlemi
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Aynı alan zaten seçili, sıralama yönünü değiştir
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Yeni bir alan seçildi, varsayılan sıralama düzenini kullan
      setSortBy(field)
      setSortOrder("desc")
    }
  }
  
  // Onay diyaloğunu göster
  const showConfirmDialog = (
    title: string,
    description: string,
    action: () => void
  ) => {
    setConfirmAction({ title, description, action })
    setIsConfirmOpen(true)
  }
  
  // Onay işlemini gerçekleştir
  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction.action()
      setIsConfirmOpen(false)
    }
  }
  
  // Boykot silme işlemi
  const handleDeleteBoycott = async (id: number) => {
    try {
      const success = await deleteBoycott(id)
      
      if (success) {
        setBoycotts(prev => prev.filter(boycott => boycott.id !== id))
        toast.success("Boykot başarıyla silindi")
      } else {
        toast.error("Boykot silinirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Boykot silme hatası:", error)
      toast.error("Boykot silinirken bir hata oluştu")
    }
  }
  
  // Boykot onaylama işlemi
  const handleApproveBoycott = async (id: number) => {
    try {
      const success = await approveBoycott(id)
      
      if (success) {
        setBoycotts(prev => prev.map(boycott => 
          boycott.id === id 
            ? { ...boycott, status: "Aktif" } 
            : boycott
        ))
        toast.success("Boykot onaylandı")
      } else {
        toast.error("Boykot onaylanırken bir hata oluştu")
      }
    } catch (error) {
      console.error("Boykot onaylama hatası:", error)
      toast.error("Boykot onaylanırken bir hata oluştu")
    }
  }
  
  // Boykot reddetme işlemi
  const handleRejectBoycott = async (id: number) => {
    try {
      const success = await rejectBoycott(id)
      
      if (success) {
        setBoycotts(prev => prev.map(boycott => 
          boycott.id === id 
            ? { ...boycott, status: "Reddedildi" } 
            : boycott
        ))
        toast.success("Boykot reddedildi")
      } else {
        toast.error("Boykot reddedilirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Boykot reddetme hatası:", error)
      toast.error("Boykot reddedilirken bir hata oluştu")
    }
  }
  
  // Boykot ekleme işlemi
  const handleAddBoycott = async () => {
    try {
      if (!editForm.title || !editForm.description || !editForm.target || !editForm.startDate) {
        toast.error("Lütfen tüm gerekli alanları doldurun")
        return
      }

      const newBoycott = {
        title: editForm.title,
        description: editForm.description,
        target: editForm.target,
        category: editForm.category,
        startDate: editForm.startDate,
        participants: editForm.participants,
        positiveVotes: editForm.positiveVotes,
        negativeVotes: editForm.negativeVotes,
        status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
        image: editForm.image
      }

      const addedBoycott = await addBoycott(newBoycott)
      
      if (addedBoycott) {
        setBoycotts(prev => [...prev, addedBoycott])
        toast.success("Yeni boykot başarıyla eklendi")
        setIsModalOpen(false)
        setIsAddMode(false)
      } else {
        toast.error("Boykot eklenirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Boykot ekleme hatası:", error)
      toast.error("Boykot eklenirken bir hata oluştu")
    }
  }

  // Oy sayılarını güncelleme işlemi
  const handleUpdateVotes = async (boycott: Boycott) => {
    try {
      const updatedBoycott = { 
        ...boycott, 
        positiveVotes: Number(editForm.positiveVotes),
        negativeVotes: Number(editForm.negativeVotes)
      }
      
      const success = await updateBoycott(updatedBoycott)
      
      if (success) {
        setBoycotts(prev => prev.map(b => 
          b.id === boycott.id ? updatedBoycott : b
        ))
        
        toast.success("Oy sayıları başarıyla güncellendi")
        setIsModalOpen(false)
      } else {
        toast.error("Oy sayıları güncellenirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Oy güncelleme hatası:", error)
      toast.error("Oy sayıları güncellenirken bir hata oluştu")
    }
  }

  // Boykot güncelleme işlemi
  const handleUpdateBoycott = async () => {
    if (!selectedBoycott) return

    try {
      if (!editForm.title || !editForm.description || !editForm.target || !editForm.startDate) {
        toast.error("Lütfen tüm gerekli alanları doldurun")
        return
      }

      const updatedBoycott = {
        ...selectedBoycott,
        title: editForm.title,
        description: editForm.description,
        target: editForm.target,
        category: editForm.category,
        startDate: editForm.startDate,
        participants: Number(editForm.participants),
        positiveVotes: Number(editForm.positiveVotes),
        negativeVotes: Number(editForm.negativeVotes),
        image: editForm.image
      }

      const success = await updateBoycott(updatedBoycott)

      if (success) {
        setBoycotts(prev => prev.map(b => 
          b.id === selectedBoycott.id ? updatedBoycott : b
        ))
        toast.success("Boykot başarıyla güncellendi")
        setIsModalOpen(false)
      } else {
        toast.error("Boykot güncellenirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Boykot güncelleme hatası:", error)
      toast.error("Boykot güncellenirken bir hata oluştu")
    }
  }

  // Modalı açma işlemi
  const openModal = (boycott: Boycott, mode: "edit" | "votes") => {
    setSelectedBoycott(boycott)
    setEditForm({
      title: boycott.title,
      description: boycott.description,
      target: boycott.target,
      category: boycott.category,
      startDate: boycott.startDate,
      participants: boycott.participants,
      positiveVotes: boycott.positiveVotes,
      negativeVotes: boycott.negativeVotes,
      image: boycott.image
    })
    
    if (mode === "edit") {
      setIsEditMode(true)
    } else {
      setIsEditMode(false)
    }
    
    setIsAddMode(false)
    setIsModalOpen(true)
  }

  // Yeni boykot eklemek için modalı açma işlemi
  const openAddModal = () => {
    setSelectedBoycott(null)
    setEditForm({
      title: "",
      description: "",
      target: "",
      category: "Tüketim",
      startDate: new Date().toLocaleDateString("tr-TR"),
      participants: 0,
      positiveVotes: 0,
      negativeVotes: 0,
      image: ""
    })
    setIsAddMode(true)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Boykot Yönetimi</h2>
          <p className="text-gray-500">Boykotları yönetin, onaylayın veya reddedin</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={loadBoycotts}
            className="flex items-center gap-1"
          >
            <RefreshCcw size={16} />
            <span className="hidden md:inline">Yenile</span>
          </Button>
          <Button 
            onClick={openAddModal}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle size={16} />
            <span>Yeni Boykot</span>
          </Button>
        </div>
      </div>
      
      {/* Filtreler */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Boykot ara..."
                className="pl-10 w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-')
                  setSortBy(newSortBy)
                  setSortOrder(newSortOrder)
                }}
              >
                <option value="participants-desc">En Çok Katılımcı (Azalan)</option>
                <option value="participants-asc">En Az Katılımcı (Artan)</option>
                <option value="votes-desc">En Çok Oy (Azalan)</option>
                <option value="votes-asc">En Az Oy (Artan)</option>
                <option value="date-desc">En Yeni Tarih</option>
                <option value="date-asc">En Eski Tarih</option>
                <option value="title-asc">İsim (A-Z)</option>
                <option value="title-desc">İsim (Z-A)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Boykot Listesi */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="bg-white">
          <CardTitle>Boykot Listesi</CardTitle>
          <CardDescription>
            {filteredBoycotts.length} boykot gösteriliyor {boycotts.length} toplamdan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      ID
                      {sortBy === "id" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      Başlık
                      {sortBy === "title" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("target")}
                    >
                      Hedef
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Kategori
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tip
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      Tarih
                      {sortBy === "date" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("participants")}
                    >
                      Katılımcı
                      {sortBy === "participants" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("votes")}
                    >
                      Oylar
                      {sortBy === "votes" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Durum
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBoycotts.map((boycott) => (
                    <tr key={boycott.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {boycott.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {boycott.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {boycott.target}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {boycott.category}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${getCategoryType(boycott.category) === "Marka" ? "bg-blue-100 text-blue-800" : 
                            getCategoryType(boycott.category) === "Ünlü" ? "bg-purple-100 text-purple-800" : 
                            "bg-gray-100 text-gray-800"}`}>
                          {getCategoryType(boycott.category) || "Diğer"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {boycott.startDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                        {boycott.participants.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span className="text-green-600">{boycott.positiveVotes}</span>
                          <span>/</span>
                          <span className="text-red-600">{boycott.negativeVotes}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          boycott.status === "Aktif" ? "bg-green-100 text-green-800" :
                          boycott.status === "Onay Bekliyor" ? "bg-yellow-100 text-yellow-800" :
                          boycott.status === "Reddedildi" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {boycott.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => openModal(boycott, "edit")}
                            title="Düzenle"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => showConfirmDialog("Sil", "Bu boykotu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.", () => handleDeleteBoycott(boycott.id))}
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                          {boycott.status === "Onay Bekliyor" && (
                            <>
                              <button
                                className="p-1 rounded-full hover:bg-gray-100"
                                onClick={() => showConfirmDialog("Onayla", "Bu boykotu onaylamak istediğinizden emin misiniz?", () => handleApproveBoycott(boycott.id))}
                                title="Onayla"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </button>
                              <button
                                className="p-1 rounded-full hover:bg-gray-100"
                                onClick={() => showConfirmDialog("Reddet", "Bu boykotu reddetmek istediğinizden emin misiniz?", () => handleRejectBoycott(boycott.id))}
                                title="Reddet"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBoycotts.length === 0 && !loading && (
                <div className="text-center py-10">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <p className="text-gray-500 text-lg">Filtrelere uygun boykot bulunamadı</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("Tümü")
                      setSelectedStatus("Tümü")
                    }}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Filtreleri Sıfırla
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog */}
      {confirmAction && (
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>{confirmAction.title}</DialogTitle>
              <DialogDescription>{confirmAction.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Onayla
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {isAddMode 
                ? "Yeni Boykot Ekle" 
                : isEditMode 
                  ? "Boykot Düzenle" 
                  : "Oy Sayılarını Düzenle"}
            </DialogTitle>
            <DialogDescription>
              {isAddMode 
                ? "Yeni bir boykot eklemek için aşağıdaki formu doldurun." 
                : isEditMode 
                  ? "Boykotu düzenlemek için bilgileri güncelleyin." 
                  : "Oy sayılarını düzenlemek için aşağıdaki değerleri güncelleyin."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {(isAddMode || isEditMode) && (
              <>
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="title" className="text-sm font-medium">Başlık</label>
                  <input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="description" className="text-sm font-medium">Açıklama</label>
                  <textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    rows={3}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="target" className="text-sm font-medium">Hedef</label>
                  <input
                    id="target"
                    value={editForm.target}
                    onChange={(e) => setEditForm({ ...editForm, target: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="category" className="text-sm font-medium">Kategori</label>
                  <select
                    id="category"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  >
                    {categories.filter(c => c !== "Tümü").map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="startDate" className="text-sm font-medium">Başlangıç Tarihi</label>
                  <input
                    id="startDate"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    placeholder="GG.AA.YYYY"
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="image" className="text-sm font-medium">Görsel URL</label>
                  <input
                    id="image"
                    value={editForm.image || ""}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    placeholder="https://..."
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="participants" className="text-sm font-medium">Katılımcı Sayısı</label>
                  <input
                    id="participants"
                    type="number"
                    value={editForm.participants}
                    onChange={(e) => setEditForm({ ...editForm, participants: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    min="0"
                  />
                </div>
              </>
            )}
            
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="positiveVotes" className="text-sm font-medium">Olumlu Oy Sayısı</label>
              <input
                id="positiveVotes"
                type="number"
                value={editForm.positiveVotes}
                onChange={(e) => setEditForm({ ...editForm, positiveVotes: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                min="0"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="negativeVotes" className="text-sm font-medium">Olumsuz Oy Sayısı</label>
              <input
                id="negativeVotes"
                type="number"
                value={editForm.negativeVotes}
                onChange={(e) => setEditForm({ ...editForm, negativeVotes: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                min="0"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              İptal
            </Button>
            <Button 
              onClick={
                isAddMode 
                  ? handleAddBoycott 
                  : isEditMode 
                    ? handleUpdateBoycott 
                    : () => handleUpdateVotes(selectedBoycott!)
              }
            >
              {isAddMode 
                ? "Ekle" 
                : isEditMode 
                  ? "Güncelle" 
                  : "Oyları Güncelle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 