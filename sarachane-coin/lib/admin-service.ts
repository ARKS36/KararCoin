// Admin paneli için veri servisleri
import { Boycott, Protest, UserActivity, PendingApproval, EventItem } from "./types";
import { 
  getBoycotts as getDataServiceBoycotts, 
  getProtests as getDataServiceProtests,
  approveBoycott as dataServiceApproveBoycott,
  rejectBoycott as dataServiceRejectBoycott,
  approveProtest as dataServiceApproveProtest,
  rejectProtest as dataServiceRejectProtest,
  getVisitCount,
  STORAGE_KEYS
} from "./data-service";

// İstatistik verilerini alma
export const getStats = async () => {
  try {
    // Ana uygulamadan boykot ve protestoları al
    const boycotts = await getDataServiceBoycotts();
    const protests = await getDataServiceProtests();
    const visitCount = getVisitCount();
    
    // Son 30 günde eklenen öğe sayısını hesapla
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentBoycotts = boycotts.filter(item => {
      const itemDate = parseDate(item.startDate);
      return itemDate >= thirtyDaysAgo;
    });
    
    const recentProtests = protests.filter(item => {
      const itemDate = parseDate(item.startDate);
      return itemDate >= thirtyDaysAgo;
    });
    
    // Değişim yüzdeleri
    const boycottChange = boycotts.length > 0 
      ? `+${Math.round((recentBoycotts.length / boycotts.length) * 100)}%` 
      : "+0%";
      
    const protestChange = protests.length > 0 
      ? `+${Math.round((recentProtests.length / protests.length) * 100)}%` 
      : "+0%";
    
    // Token işlem sayısını tahmin et (mevcut uygulama mantığına göre)
    const estimatedTransactions = Math.floor(visitCount * 0.3);
    
    return {
      totalBoycotts: boycotts.length,
      totalProtests: protests.length,
      totalVisits: visitCount,
      totalTokenTransactions: estimatedTransactions,
      boycottChange,
      protestChange,
      visitChange: "+15%", // Mock data
      tokenChange: "+8%"   // Mock data
    };
  } catch (error) {
    console.error("İstatistik verilerini alma hatası:", error);
    return {
      totalBoycotts: 0,
      totalProtests: 0,
      totalVisits: 0,
      totalTokenTransactions: 0,
      boycottChange: "+0%",
      protestChange: "+0%",
      visitChange: "+0%",
      tokenChange: "+0%"
    };
  }
};

// Tarih formatını parse et (DD.MM.YYYY)
const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
};

// Boykotları getir - data-service'den al
export const getBoycotts = async (): Promise<Boycott[]> => {
  return await getDataServiceBoycotts();
};

// Boykotu güncelle
export const updateBoycott = async (updatedBoycott: Boycott): Promise<boolean> => {
  try {
    const boycotts = await getBoycotts();
    const updatedBoycotts = boycotts.map(boycott => 
      boycott.id === updatedBoycott.id ? updatedBoycott : boycott
    );
    
    localStorage.setItem(STORAGE_KEYS.BOYCOTTS, JSON.stringify(updatedBoycotts));
    return true;
  } catch (error) {
    console.error("Boykot güncelleme hatası:", error);
    return false;
  }
};

// Boykot silme
export const deleteBoycott = async (id: number): Promise<boolean> => {
  try {
    const boycotts = await getBoycotts();
    const filteredBoycotts = boycotts.filter(boycott => boycott.id !== id);
    
    localStorage.setItem(STORAGE_KEYS.BOYCOTTS, JSON.stringify(filteredBoycotts));
    return true;
  } catch (error) {
    console.error("Boykot silme hatası:", error);
    return false;
  }
};

// Protestoları getir - data-service'den al
export const getProtests = async (): Promise<Protest[]> => {
  return await getDataServiceProtests();
};

// Kullanıcı aktivitelerini getir
export const getUserActivities = async (): Promise<UserActivity[]> => {
  // localStorage'dan aktiviteleri al
  const storedActivities = localStorage.getItem("kararCoin_userActivities");
  let activities: UserActivity[] = [];
  
  if (storedActivities) {
    try {
      activities = JSON.parse(storedActivities);
    } catch (e) {
      console.error("Aktiviteleri parse etme hatası:", e);
    }
  }
  
  // Örnek veriler yoksa default verileri kullan
  if (!activities || activities.length === 0) {
    activities = getDefaultUserActivities();
    localStorage.setItem("kararCoin_userActivities", JSON.stringify(activities));
  }
  
  // Son aktiviteleri getir (zaman damgasına göre sıralı)
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Onay bekleyen işlemleri getir
export const getPendingApprovals = async (): Promise<PendingApproval[]> => {
  // Onay bekleyen boykot ve protestoları getir
  const boycotts = await getBoycotts();
  const protests = await getProtests();
  
  const pendingBoycotts = boycotts
    .filter(b => b.status === "Onay Bekliyor")
    .map(b => ({
      id: b.id,
      type: "Boykot" as const,
      title: b.title,
      requester: b.creator || "Bilinmeyen Kullanıcı",
      date: b.startDate,
      itemData: b
    }));
    
  const pendingProtests = protests
    .filter(p => p.status === "Onay Bekliyor")
    .map(p => ({
      id: p.id,
      type: "Protesto" as const,
      title: p.title,
      requester: p.creator || "Bilinmeyen Kullanıcı",
      date: p.startDate,
      itemData: p
    }));
    
  return [...pendingBoycotts, ...pendingProtests].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

// Yaklaşan etkinlikleri getir
export const getUpcomingEvents = async (): Promise<EventItem[]> => {
  const boycotts = await getBoycotts();
  const protests = await getProtests();
  
  // Bugün ve gelecekteki etkinlikleri filtrele
  const now = new Date();
  
  const upcomingBoycotts = boycotts
    .filter(b => {
      const date = parseDate(b.startDate);
      return date >= now && b.status === "Aktif";
    })
    .map(b => ({
      id: b.id,
      type: "Boykot" as const,
      title: b.title,
      location: b.target,
      date: b.startDate,
      participants: b.participants,
      itemData: b
    }));
    
  const upcomingProtests = protests
    .filter(p => {
      const date = parseDate(p.startDate);
      return date >= now && p.status === "Aktif";
    })
    .map(p => ({
      id: p.id,
      type: "Protesto" as const,
      title: p.title,
      location: p.location || "Online",
      date: p.startDate,
      participants: p.participants,
      itemData: p
    }));
    
  return [...upcomingBoycotts, ...upcomingProtests].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateA.getTime() - dateB.getTime();
  });
};

// Boykot onaylama - data-service'deki onaylama işlevini kullan
export const approveBoycott = async (id: number): Promise<boolean> => {
  return await dataServiceApproveBoycott(id);
};

// Boykot reddetme - data-service'deki reddetme işlevini kullan
export const rejectBoycott = async (id: number): Promise<boolean> => {
  return await dataServiceRejectBoycott(id);
};

// Protesto onaylama - data-service'deki onaylama işlevini kullan
export const approveProtest = async (id: number): Promise<boolean> => {
  return await dataServiceApproveProtest(id);
};

// Protesto reddetme - data-service'deki reddetme işlevini kullan
export const rejectProtest = async (id: number): Promise<boolean> => {
  return await dataServiceRejectProtest(id);
};

// Örnek Kullanıcı Aktiviteleri
const getDefaultUserActivities = (): UserActivity[] => {
  return [
    {
      id: 1,
      user: "ahmet34",
      action: "Oy Kullanma",
      details: "\"Teknoloji Devi Veri Gizliliği\" boykotuna oy kullandı",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      user: "ayse_eco",
      action: "Boykot Önerme",
      details: "\"Sürdürülebilir Ambalaj Kampanyası\" adlı bir boykot önerdi",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      user: "mehmetd",
      action: "Oy Kullanma",
      details: "\"İşçi Hakları Yürüyüşü\" protestosuna oy kullandı",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      user: "zeynepkaya",
      action: "Protesto Önerme",
      details: "\"Yeşil Alanları Koruma\" adlı bir protesto önerdi",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 5,
      user: "can_y",
      action: "Boykot Paylaşma",
      details: "\"Hızlı Moda Boykotu\" boykotunu sosyal medyada paylaştı",
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 6,
      user: "ahmet34",
      action: "Token Transferi",
      details: "Cüzdanına 100 Karar Coin yükledi",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 7,
      user: "ece_s",
      action: "Yorum Yapma",
      details: "\"Çevre Koruma Mitingi\" protestosuna yorum yaptı",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}; 