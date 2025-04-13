"use client"

import React, { useState, useEffect } from "react"
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { 
  Search, 
  ChevronDown, 
  Users, 
  Calendar, 
  MapPin, 
  Plus, 
  Edit, 
  Trash, 
  CheckCircle, 
  XCircle, 
  ArrowUpDown,
  RefreshCw,
  PlusCircle,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  getProtests, 
  deleteProtest, 
  approveProtest, 
  rejectProtest, 
  updateProtest,
  addProtest
} from "@/lib/data-service"
import { Protest } from "@/lib/types"

// Protesto kategorileri
const protestCategories = [
  "Tüm Kategoriler",
  "İnsan Hakları",
  "Çevre",
  "Ekonomi",
  "Eğitim",
  "Sağlık",
  "Ulaşım",
  "Diğer"
]

// Protesto durumları
const protestStatuses = [
  "Tüm Durumlar",
  "Aktif",
  "Onay Bekliyor",
  "Reddedildi",
  "Sona Erdi"
]

// Protesto Yönetim Sayfası
export default function ProtestsPage() {
  const [protests, setProtests] = useState<Protest[]>([])
  const [filteredProtests, setFilteredProtests] = useState<Protest[]>([])
  const [selectedProtest, setSelectedProtest] = useState<Protest | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tüm Kategoriler")
  const [selectedStatus, setSelectedStatus] = useState("Tüm Durumlar")
  const [sortBy, setSortBy] = useState<keyof Protest>("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
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
    location: string;
    category: string;
    startDate: string;
    participants: number;
    positiveVotes: number;
    negativeVotes: number;
    image?: string;
  }>({
    title: "",
    description: "",
    location: "",
    category: "İnsan Hakları",
    startDate: "",
    participants: 0,
    positiveVotes: 0,
    negativeVotes: 0,
    image: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false)

  // Verileri yükle
  useEffect(() => {
    loadProtests()
  }, [])

  // Protestoları yükle
  const loadProtests = async () => {
    try {
      setLoading(true)
      const data = await getProtests()
      setProtests(data)
      setFilteredProtests(data)
    } catch (error) {
      console.error("Protestolar yüklenirken hata:", error)
      toast.error("Protestolar yüklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  // Filtreleri uygula
  useEffect(() => {
    let result = [...protests]
    
    // Arama filtresi
    if (searchTerm) {
      result = result.filter(protest => 
        protest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (protest.description && protest.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (protest.location && protest.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Kategori filtresi
    if (selectedCategory !== "Tüm Kategoriler") {
      result = result.filter(protest => protest.category === selectedCategory)
    }
    
    // Durum filtresi
    if (selectedStatus !== "Tüm Durumlar") {
      result = result.filter(protest => protest.status === selectedStatus)
    }
    
    // Sıralama
    if (sortBy) {
      result = result.sort((a, b) => {
        const valueA = a[sortBy as keyof Protest];
        const valueB = b[sortBy as keyof Protest];
        
        // Handle undefined values
        if (valueA === undefined && valueB === undefined) return 0;
        if (valueA === undefined) return sortOrder === "asc" ? -1 : 1;
        if (valueB === undefined) return sortOrder === "asc" ? 1 : -1;
        
        // Handle string comparison
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortOrder === "asc" 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        // Handle number comparison
        if (valueA < valueB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredProtests(result)
  }, [protests, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder])
  
  // Sıralama işlemi
  const handleSort = (field: keyof Protest) => {
    setSortBy(field)
    setSortOrder(prev => prev === "asc" ? "desc" : "asc")
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
  
  // Protestoyu sil
  const handleDeleteProtest = async (id: number) => {
    try {
      const success = await deleteProtest(id)
      
      if (success) {
        setProtests(prev => prev.filter(protest => protest.id !== id))
        toast.success("Protesto başarıyla silindi")
      } else {
        toast.error("Protesto silinirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Protesto silme hatası:", error)
      toast.error("Protesto silinirken bir hata oluştu")
    }
  }
  
  // Protestoyu onayla
  const handleApproveProtest = async (id: number) => {
    try {
      const success = await approveProtest(id)
      
      if (success) {
        setProtests(prev => 
          prev.map(protest => 
            protest.id === id ? { ...protest, status: "Aktif" } : protest
          )
        )
        toast.success("Protesto başarıyla onaylandı")
      } else {
        toast.error("Protesto onaylanırken bir hata oluştu")
      }
    } catch (error) {
      console.error("Protesto onaylama hatası:", error)
      toast.error("Protesto onaylanırken bir hata oluştu")
    }
  }
  
  // Protestoyu reddet
  const handleRejectProtest = async (id: number) => {
    try {
      const success = await rejectProtest(id)
      
      if (success) {
        setProtests(prev => 
          prev.map(protest => 
            protest.id === id ? { ...protest, status: "Reddedildi" } : protest
          )
        )
        toast.success("Protesto başarıyla reddedildi")
      } else {
        toast.error("Protesto reddedilirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Protesto reddetme hatası:", error)
      toast.error("Protesto reddedilirken bir hata oluştu")
    }
  }

  // Protesto ekleme
  const handleAddProtest = async () => {
    try {
      if (!editForm.title || !editForm.description || !editForm.startDate) {
        toast.error("Lütfen gerekli tüm alanları doldurunuz.");
        return;
      }

      const newProtest = {
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
        category: editForm.category,
        startDate: editForm.startDate,
        participants: editForm.participants,
        positiveVotes: 0,
        negativeVotes: 0,
        status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
        image: editForm.image || "/placeholder.svg?height=200&width=400"
      };

      console.log("Adding new protest:", newProtest);
      const result = await addProtest(newProtest);
      console.log("Add protest result:", result);

      if (result) {
        setProtests(prev => [...prev, result]);
        toast.success("Protesto başarıyla eklendi.");
        setIsAddMode(false);
      } else {
        toast.error("Protesto eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Protesto ekleme hatası:", error);
      toast.error("Protesto eklenirken bir hata oluştu.");
    }
  }

  // Protesto güncelleme
  const handleUpdateProtest = async () => {
    if (!selectedProtest) return

    try {
      if (!editForm.title || !editForm.description || !editForm.startDate) {
        toast.error("Lütfen gerekli tüm alanları doldurunuz.")
        return
      }

      const updatedProtest = {
        ...selectedProtest,
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
        category: editForm.category,
        startDate: editForm.startDate,
        participants: Number(editForm.participants),
        positiveVotes: Number(editForm.positiveVotes),
        negativeVotes: Number(editForm.negativeVotes),
        image: editForm.image
      }

      const success = await updateProtest(updatedProtest)

      if (success) {
        setProtests(prev => prev.map(p => 
          p.id === selectedProtest.id ? updatedProtest : p
        ))
        toast.success("Protesto başarıyla güncellendi.")
        setIsEditMode(false)
        setSelectedProtest(null)
      } else {
        toast.error("Protesto güncellenirken bir hata oluştu.")
      }
    } catch (error) {
      console.error("Protesto güncelleme hatası:", error)
      toast.error("Protesto güncellenirken bir hata oluştu.")
    }
  }

  // Oy sayılarını güncelleme
  const handleUpdateVotes = async () => {
    if (!selectedProtest) return

    try {
      const updatedProtest = {
        ...selectedProtest,
        positiveVotes: Number(editForm.positiveVotes),
        negativeVotes: Number(editForm.negativeVotes)
      }

      const success = await updateProtest(updatedProtest)

      if (success) {
        setProtests(prev => prev.map(p => 
          p.id === selectedProtest.id ? updatedProtest : p
        ))
        toast.success("Oy sayıları başarıyla güncellendi.")
        setSelectedProtest(null)
      } else {
        toast.error("Oy sayıları güncellenirken bir hata oluştu.")
      }
    } catch (error) {
      console.error("Oy güncelleme hatası:", error)
      toast.error("Oy sayıları güncellenirken bir hata oluştu.")
    }
  }

  // Yeni protesto eklemek için modalı aç
  const openAddModal = () => {
    setSelectedProtest(null)
    const today = new Date()
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`
    
    setEditForm({
      title: "",
      description: "",
      location: "",
      category: "İnsan Hakları",
      startDate: formattedDate,
      participants: 0,
      positiveVotes: 0,
      negativeVotes: 0,
      image: ""
    })
    setIsAddMode(true)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  // Modalı açma
  const openModal = (protest: Protest, mode: "edit" | "votes") => {
    setSelectedProtest(protest)
    setEditForm({
      title: protest.title,
      description: protest.description,
      location: protest.location || "",
      category: protest.category,
      startDate: protest.startDate,
      participants: protest.participants,
      positiveVotes: protest.positiveVotes,
      negativeVotes: protest.negativeVotes,
      image: protest.image
    })
    
    if (mode === "edit") {
      setIsEditMode(true)
      setIsAddMode(false)
      setIsDialogOpen(true)
      setIsVoteDialogOpen(false)
    } else {
      setIsEditMode(false)
      setIsAddMode(false)
      setIsDialogOpen(false)
      setIsVoteDialogOpen(true)
    }
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Protesto Yönetimi</h2>
          <p className="text-gray-500">Protestoları yönetin, onaylayın veya reddedin</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={loadProtests}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} />
            <span className="hidden md:inline">Yenile</span>
          </Button>
          <Button 
            onClick={openAddModal}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle size={16} />
            <span>Yeni Protesto</span>
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
                placeholder="Protesto ara..."
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
                {protestCategories.map(category => (
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
                {protestStatuses.map(status => (
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
                  setSortBy(newSortBy as keyof Protest)
                  setSortOrder(newSortOrder as "asc" | "desc")
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
      
      {/* Protesto Listesi */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="bg-white">
          <CardTitle>Protesto Listesi</CardTitle>
          <CardDescription>
            {filteredProtests.length} protesto gösteriliyor {protests.length} toplamdan
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlık
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konum
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Katılımcı
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProtests.map((protest) => (
                    <tr key={protest.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {protest.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {protest.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {protest.location || "Belirtilmemiş"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {protest.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {protest.startDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {protest.participants.toLocaleString("tr-TR")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          protest.status === "Aktif" 
                            ? "bg-green-100 text-green-800"
                            : protest.status === "Onay Bekliyor"
                            ? "bg-yellow-100 text-yellow-800"
                            : protest.status === "Reddedildi"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {protest.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-700 hover:text-gray-900"
                            onClick={() => {
                              setSelectedProtest(protest)
                              setIsEditMode(true)
                            }}
                            title="Düzenle"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-900"
                            onClick={() => showConfirmDialog(
                              "Sil", 
                              "Bu protestoyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.", 
                              () => handleDeleteProtest(protest.id)
                            )}
                            title="Sil"
                          >
                            <Trash size={16} />
                          </Button>

                          {protest.status === "Onay Bekliyor" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-green-600 hover:text-green-900"
                                onClick={() => showConfirmDialog(
                                  "Onayla", 
                                  "Bu protestoyu onaylamak istediğinizden emin misiniz?", 
                                  () => handleApproveProtest(protest.id)
                                )}
                                title="Onayla"
                              >
                                <CheckCircle size={16} />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-900"
                                onClick={() => showConfirmDialog(
                                  "Reddet", 
                                  "Bu protestoyu reddetmek istediğinizden emin misiniz?", 
                                  () => handleRejectProtest(protest.id)
                                )}
                                title="Reddet"
                              >
                                <XCircle size={16} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredProtests.length === 0 && !loading && (
                <div className="text-center py-10">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <p className="text-gray-500 text-lg">Filtrelere uygun protesto bulunamadı</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("Tümü")
                      setSelectedStatus("Tümü")
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
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
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setIsAddMode(false);
          setIsEditMode(false);
        }
      }}>
        <DialogContent className="max-w-md mx-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {isAddMode ? "Yeni Protesto Ekle" : "Protestoyu Düzenle"}
            </DialogTitle>
            <DialogDescription>
              {isAddMode ? "Yeni bir protesto oluştur." : "Mevcut protesto bilgilerini güncelle."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Başlık*
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Protesto başlığı"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black mb-1">
                Kategori*
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              >
                {protestCategories.filter(c => c !== "Tüm Kategoriler").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black mb-1">
                Konum*
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="İstanbul, Ankara, vb."
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black mb-1">
                Başlangıç Tarihi*
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={editForm.startDate}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                placeholder="DD.MM.YYYY"
              />
              <p className="text-xs text-gray-700 mt-1">Format: GG.AA.YYYY (ör. 15.04.2023)</p>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black mb-1">
                Katılımcı Sayısı
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={editForm.participants}
                min={0}
                onChange={(e) => setEditForm({ ...editForm, participants: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Açıklama*
              </label>
              <textarea
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Protesto hakkında detaylı açıklama"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Görsel URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={editForm.image || ""}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-700 mt-1">Boş bırakılırsa varsayılan görsel kullanılacaktır</p>
            </div>
            
            {!isAddMode && (
              <>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-black mb-1">
                    Olumlu Oylar
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    value={editForm.positiveVotes}
                    min={0}
                    onChange={(e) => setEditForm({ ...editForm, positiveVotes: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-black mb-1">
                    Olumsuz Oylar
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    value={editForm.negativeVotes}
                    min={0}
                    onChange={(e) => setEditForm({ ...editForm, negativeVotes: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddMode(false);
                setIsEditMode(false);
              }}
            >
              İptal
            </Button>
            <Button
              onClick={isAddMode ? handleAddProtest : handleUpdateProtest}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAddMode ? "Ekle" : "Güncelle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vote Dialog */}
      <Dialog open={isVoteDialogOpen} onOpenChange={(open) => {
        setIsVoteDialogOpen(open);
        if (!open) {
          setSelectedProtest(null);
        }
      }}>
        <DialogContent className="max-w-md mx-auto bg-white">
          <DialogHeader>
            <DialogTitle>Oy Sayılarını Düzenle</DialogTitle>
            <DialogDescription>
              {selectedProtest?.title} için oy sayılarını düzenleyin
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
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
            <Button variant="outline" onClick={() => setSelectedProtest(null)}>
              İptal
            </Button>
            <Button onClick={handleUpdateVotes}>
              Oyları Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 