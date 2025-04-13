// Unified data service for the main site and admin panel
import { Boycott, Protest, UserVote } from "./types";

// Storage keys
export const STORAGE_KEYS = {
  BOYCOTTS: "kararCoin_boycotts",
  PROTESTS: "kararCoin_protests",
  USER_VOTES: "kararCoin_userVotes",
  VISITS: "kararCoin_visits",
  ACTIVE_WALLET: "kararCoin_activeWallet",
  SETTINGS: "kararCoin_settings"
};

// Helper functions
export const parseDate = (dateStr: string) => {
  try {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error("Date parsing error:", error);
    return new Date();
  }
};

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Counter for site visits
export const incrementVisitCount = (): number => {
  if (typeof window === 'undefined') return 0;
  
  const currentCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISITS) || '0');
  const newCount = currentCount + 1;
  localStorage.setItem(STORAGE_KEYS.VISITS, newCount.toString());
  return newCount;
};

export const getVisitCount = (): number => {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(STORAGE_KEYS.VISITS) || '0');
};

// Get all boycotts
export const getBoycotts = async (): Promise<Boycott[]> => {
  if (typeof window === 'undefined') return [];
  
  // Try to get from localStorage
  const storedBoycotts = localStorage.getItem(STORAGE_KEYS.BOYCOTTS);
  let boycotts: Boycott[] = [];
  
  if (storedBoycotts) {
    try {
      boycotts = JSON.parse(storedBoycotts);
    } catch (error) {
      console.error("Error parsing boycotts:", error);
    }
  }
  
  // If no data, use default data
  if (!boycotts || boycotts.length === 0) {
    boycotts = getDefaultBoycotts();
    saveBoycotts(boycotts);
  }
  
  return boycotts;
};

// Save boycotts
export const saveBoycotts = (boycotts: Boycott[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BOYCOTTS, JSON.stringify(boycotts));
};

// Add new boycott
export const addBoycott = async (boycott: Omit<Boycott, "id">): Promise<Boycott> => {
  const boycotts = await getBoycotts();
  
  // Generate new ID
  const newId = boycotts.length > 0 
    ? Math.max(...boycotts.map(b => b.id)) + 1 
    : 1;
  
  const newBoycott: Boycott = {
    ...boycott,
    id: newId,
    status: boycott.status || "Onay Bekliyor",
    positiveVotes: boycott.positiveVotes || 0,
    negativeVotes: boycott.negativeVotes || 0
  };
  
  boycotts.push(newBoycott);
  saveBoycotts(boycotts);
  
  return newBoycott;
};

// Update boycott
export const updateBoycott = async (updatedBoycott: Boycott): Promise<boolean> => {
  try {
    const boycotts = await getBoycotts();
    const updatedBoycotts = boycotts.map(boycott => 
      boycott.id === updatedBoycott.id ? updatedBoycott : boycott
    );
    
    saveBoycotts(updatedBoycotts);
    return true;
  } catch (error) {
    console.error("Error updating boycott:", error);
    return false;
  }
};

// Delete boycott
export const deleteBoycott = async (id: number): Promise<boolean> => {
  try {
    const boycotts = await getBoycotts();
    const filteredBoycotts = boycotts.filter(boycott => boycott.id !== id);
    
    saveBoycotts(filteredBoycotts);
    return true;
  } catch (error) {
    console.error("Error deleting boycott:", error);
    return false;
  }
};

// Approve boycott
export const approveBoycott = async (id: number): Promise<boolean> => {
  try {
    const boycotts = await getBoycotts();
    const updatedBoycotts = boycotts.map(boycott => 
      boycott.id === id ? { ...boycott, status: "Aktif" } : boycott
    );
    
    saveBoycotts(updatedBoycotts);
    return true;
  } catch (error) {
    console.error("Error approving boycott:", error);
    return false;
  }
};

// Reject boycott
export const rejectBoycott = async (id: number): Promise<boolean> => {
  try {
    const boycotts = await getBoycotts();
    const updatedBoycotts = boycotts.map(boycott => 
      boycott.id === id ? { ...boycott, status: "Reddedildi" } : boycott
    );
    
    saveBoycotts(updatedBoycotts);
    return true;
  } catch (error) {
    console.error("Error rejecting boycott:", error);
    return false;
  }
};

// Get all protests
export const getProtests = async (): Promise<Protest[]> => {
  if (typeof window === 'undefined') return [];
  
  // Try to get from localStorage
  const storedProtests = localStorage.getItem(STORAGE_KEYS.PROTESTS);
  let protests: Protest[] = [];
  
  if (storedProtests) {
    try {
      protests = JSON.parse(storedProtests);
    } catch (error) {
      console.error("Error parsing protests:", error);
    }
  }
  
  // If no data, use default data
  if (!protests || protests.length === 0) {
    protests = getDefaultProtests();
    saveProtests(protests);
  }
  
  return protests;
};

// Save protests
export const saveProtests = (protests: Protest[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROTESTS, JSON.stringify(protests));
};

// Add new protest
export const addProtest = async (protest: Omit<Protest, "id">): Promise<Protest> => {
  const protests = await getProtests();
  
  // Generate new ID
  const newId = protests.length > 0 
    ? Math.max(...protests.map(p => p.id)) + 1 
    : 1;
  
  const newProtest: Protest = {
    ...protest,
    id: newId,
    status: protest.status || "Onay Bekliyor",
    positiveVotes: protest.positiveVotes || 0,
    negativeVotes: protest.negativeVotes || 0
  };
  
  protests.push(newProtest);
  saveProtests(protests);
  
  return newProtest;
};

// Update protest
export const updateProtest = async (updatedProtest: Protest): Promise<boolean> => {
  try {
    const protests = await getProtests();
    const updatedProtests = protests.map(protest => 
      protest.id === updatedProtest.id ? updatedProtest : protest
    );
    
    saveProtests(updatedProtests);
    return true;
  } catch (error) {
    console.error("Error updating protest:", error);
    return false;
  }
};

// Delete protest
export const deleteProtest = async (id: number): Promise<boolean> => {
  try {
    const protests = await getProtests();
    const filteredProtests = protests.filter(protest => protest.id !== id);
    
    saveProtests(filteredProtests);
    return true;
  } catch (error) {
    console.error("Error deleting protest:", error);
    return false;
  }
};

// Approve protest
export const approveProtest = async (id: number): Promise<boolean> => {
  try {
    const protests = await getProtests();
    const updatedProtests = protests.map(protest => 
      protest.id === id ? { ...protest, status: "Aktif" } : protest
    );
    
    saveProtests(updatedProtests);
    return true;
  } catch (error) {
    console.error("Error approving protest:", error);
    return false;
  }
};

// Reject protest
export const rejectProtest = async (id: number): Promise<boolean> => {
  try {
    const protests = await getProtests();
    const updatedProtests = protests.map(protest => 
      protest.id === id ? { ...protest, status: "Reddedildi" } : protest
    );
    
    saveProtests(updatedProtests);
    return true;
  } catch (error) {
    console.error("Error rejecting protest:", error);
    return false;
  }
};

// Get user votes
export const getUserVotes = async (walletAddress: string): Promise<UserVote[]> => {
  if (typeof window === 'undefined') return [];
  
  const storedVotes = localStorage.getItem(STORAGE_KEYS.USER_VOTES);
  let allVotes: Record<string, UserVote[]> = {};
  
  if (storedVotes) {
    try {
      allVotes = JSON.parse(storedVotes);
    } catch (error) {
      console.error("Error parsing user votes:", error);
    }
  }
  
  return allVotes[walletAddress] || [];
};

// Save user vote
export const saveUserVote = async (
  walletAddress: string, 
  itemType: "Boykot" | "Protesto", 
  itemId: number, 
  voteType: "positive" | "negative",
  voteCount: number = 1
): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const storedVotes = localStorage.getItem(STORAGE_KEYS.USER_VOTES);
    let allVotes: Record<string, UserVote[]> = {};
    
    if (storedVotes) {
      allVotes = JSON.parse(storedVotes);
    }
    
    // Get user's votes
    const userVotes = allVotes[walletAddress] || [];
    
    // Check if user already voted for this item
    const existingVoteIndex = userVotes.findIndex(
      vote => vote.itemType === itemType && vote.itemId === itemId
    );
    
    // Add or update vote
    const timestamp = new Date().toISOString();
    
    if (existingVoteIndex >= 0) {
      userVotes[existingVoteIndex] = {
        ...userVotes[existingVoteIndex],
        voteType,
        voteCount,
        timestamp
      };
    } else {
      userVotes.push({
        itemType,
        itemId,
        voteType,
        voteCount,
        timestamp
      });
    }
    
    // Update item vote count
    if (itemType === "Boykot") {
      const boycotts = await getBoycotts();
      const boycott = boycotts.find(b => b.id === itemId);
      
      if (boycott) {
        if (voteType === "positive") {
          boycott.positiveVotes += voteCount;
        } else {
          boycott.negativeVotes += voteCount;
        }
        await updateBoycott(boycott);
      }
    } else {
      const protests = await getProtests();
      const protest = protests.find(p => p.id === itemId);
      
      if (protest) {
        if (voteType === "positive") {
          protest.positiveVotes += voteCount;
        } else {
          protest.negativeVotes += voteCount;
        }
        await updateProtest(protest);
      }
    }
    
    // Save updated votes
    allVotes[walletAddress] = userVotes;
    localStorage.setItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(allVotes));
    
    return true;
  } catch (error) {
    console.error("Error saving user vote:", error);
    return false;
  }
};

// Get site statistics
export const getSiteStats = async () => {
  const boycotts = await getBoycotts();
  const protests = await getProtests();
  const visitCount = getVisitCount();
  
  // Calculate changes
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
  
  const boycottChange = boycotts.length > 0 
    ? `+${Math.round((recentBoycotts.length / boycotts.length) * 100)}%` 
    : "+0%";
    
  const protestChange = protests.length > 0 
    ? `+${Math.round((recentProtests.length / protests.length) * 100)}%` 
    : "+0%";
  
  return {
    totalBoycotts: boycotts.length,
    totalProtests: protests.length,
    totalVisits: visitCount,
    totalTokenTransactions: Math.floor(visitCount * 0.3), // Simulate transaction count
    boycottChange,
    protestChange,
    visitChange: "+15%", // Mock data
    tokenChange: "+8%" // Mock data
  };
};

// Get pending approvals
export const getPendingApprovals = async () => {
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

// Default boycotts data
export const getDefaultBoycotts = (): Boycott[] => {
  return [
    {
      id: 1,
      title: "Hızlı Moda Boykotu",
      target: "Çeşitli Giyim Markaları",
      category: "Tüketim",
      startDate: "10.03.2023",
      participants: 12500,
      description: "Kötü çalışma koşulları ve çevresel zararlarıyla bilinen hızlı moda markalarına karşı boykot.",
      positiveVotes: 2800,
      negativeVotes: 445,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Teknoloji Devi Veri Gizliliği",
      target: "Büyük Teknoloji Şirketi",
      category: "Teknoloji",
      startDate: "22.04.2023",
      participants: 8700,
      description: "Veri gizliliği ihlalleri ve gözetleme uygulamaları nedeniyle büyük bir teknoloji şirketine karşı boykot.",
      positiveVotes: 1900,
      negativeVotes: 287,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "Sürdürülebilir Gıda Hareketi",
      target: "Gıda Şirketi",
      category: "Market",
      startDate: "15.02.2023",
      participants: 5300,
      description: "Zararlı pestisitler ve sürdürülemez tarım uygulamaları kullanan gıda şirketlerine karşı boykot.",
      positiveVotes: 1200,
      negativeVotes: 367,
      status: "Onay Bekliyor",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 4,
      title: "Adil Ücret Kampanyası",
      target: "Perakende Zinciri",
      category: "Tüketim",
      startDate: "01.05.2023",
      participants: 9200,
      description: "Çalışanlarına adil ücret ve haklar sağlamayan perakende zincirlerine karşı boykot.",
      positiveVotes: 2500,
      negativeVotes: 376,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 5,
      title: "Plastik Ambalaja Karşı",
      target: "Tüketici Ürünleri Şirketleri",
      category: "Tüketim",
      startDate: "20.01.2023",
      participants: 7500,
      description: "Ürünlerinde aşırı plastik ambalaj kullanan şirketlere karşı boykot.",
      positiveVotes: 1700,
      negativeVotes: 245,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 6,
      title: "Temiz Enerji Savunuculuğu",
      target: "Fosil Yakıt Şirketleri",
      category: "Akaryakıt",
      startDate: "05.06.2023",
      participants: 11000,
      description: "Fosil yakıtlara yoğun yatırım yapan ve temiz enerji girişimlerine karşı çıkan şirketlere karşı boykot.",
      positiveVotes: 2900,
      negativeVotes: 223,
      status: "Onay Bekliyor",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 101,
      title: "Tartışmalı Açıklamalar",
      target: "Ünlü Oyuncu",
      category: "Oyuncular",
      startDate: "15.04.2023",
      participants: 8500,
      description: "Tartışmalı politik açıklamaları nedeniyle ünlü bir oyuncuya karşı boykot.",
      positiveVotes: 1800,
      negativeVotes: 445,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 102,
      title: "Çevresel Tutarsızlık",
      target: "Ünlü Şarkıcı",
      category: "Müzisyenler",
      startDate: "22.05.2023",
      participants: 6700,
      description: "Çevre savunuculuğu yaparken özel jetle seyahat eden ünlü şarkıcıya karşı boykot.",
      positiveVotes: 1500,
      negativeVotes: 487,
      status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 103,
      title: "Hayran Kitlesi Protestosu",
      target: "Pop Yıldızı",
      category: "Müzisyenler",
      startDate: "10.06.2023",
      participants: 7200,
      description: "Bilet fiyatlarındaki aşırı artış ve hayranlarına karşı tutumları nedeniyle ünlü pop yıldızına karşı boykot.",
      positiveVotes: 2100,
      negativeVotes: 320,
      status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 104,
      title: "Sosyal Medya Etiği",
      target: "Ünlü Fenomen",
      category: "Fenomenler",
      startDate: "05.05.2023",
      participants: 5500,
      description: "Yanıltıcı içerikler ve etik olmayan reklam anlaşmaları nedeniyle popüler sosyal medya fenomenine karşı boykot.",
      positiveVotes: 1650,
      negativeVotes: 410,
      status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 105,
      title: "Moda Tasarımcısı Tartışması",
      target: "Ünlü Tasarımcı",
      category: "Tasarımcılar",
      startDate: "12.04.2023",
      participants: 4800,
      description: "Ayrımcı açıklamaları ve tartışmalı koleksiyonu nedeniyle ünlü moda tasarımcısına karşı boykot kampanyası.",
      positiveVotes: 1250,
      negativeVotes: 380,
      status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 106,
      title: "Spor Yıldızı Protestosu",
      target: "Dünyaca Ünlü Sporcu",
      category: "Sporcular",
      startDate: "18.03.2023",
      participants: 9300,
      description: "Tartışmalı sponsorluk anlaşmaları ve politik duruşu nedeniyle dünyaca ünlü sporcuya karşı başlatılan boykot.",
      positiveVotes: 2750,
      negativeVotes: 520,
      status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 107,
      title: "Medya Figürü Eylemsizliği",
      target: "Tanınmış Sunucu",
      category: "Medya",
      startDate: "07.02.2023",
      participants: 6200,
      description: "Önemli toplumsal konularda sessiz kalması ve taraflı yayın politikası nedeniyle tanınmış medya figürüne karşı boykot.",
      positiveVotes: 1850,
      negativeVotes: 290,
      status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 108,
      title: "Politik Figür Boykotu",
      target: "Eski Siyasetçi",
      category: "Politikacılar",
      startDate: "14.01.2023",
      participants: 10500,
      description: "Görev süresi boyunca aldığı tartışmalı kararlar ve söylemleri nedeniyle eski siyasetçiye karşı boykot hareketi.",
      positiveVotes: 3200,
      negativeVotes: 680,
      status: "Aktif" as "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi",
      image: "/placeholder.svg?height=200&width=400",
    }
  ];
};

// Default protests data
export const getDefaultProtests = (): Protest[] => {
  return [
    {
      id: 1,
      title: "Üniversite Harç Protestosu",
      location: "İstanbul",
      category: "Eğitim",
      startDate: "15.05.2023",
      participants: 2500,
      description: "Öğrenciler, büyük üniversitelerdeki artan harç ücretlerine karşı protesto düzenliyor.",
      positiveVotes: 1100,
      negativeVotes: 145,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Çevre Koruma Mitingi",
      location: "Ankara",
      category: "Çevre",
      startDate: "22.06.2023",
      participants: 1800,
      description: "Vatandaşlar, ormansızlaşma ve çevresel tahribata karşı miting düzenliyor.",
      positiveVotes: 900,
      negativeVotes: 87,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "İşçi Hakları Yürüyüşü",
      location: "İzmir",
      category: "İşçi Hakları",
      startDate: "10.07.2023",
      participants: 3200,
      description: "İşçi sendikaları daha iyi çalışma koşulları ve adil ücretler için yürüyüş düzenliyor.",
      positiveVotes: 1400,
      negativeVotes: 167,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 4,
      title: "Medya Özgürlüğü Gösterisi",
      location: "İstanbul",
      category: "Medya",
      startDate: "05.08.2023",
      participants: 1500,
      description: "Gazeteciler ve vatandaşlar basın özgürlüğü için ve sansüre karşı gösteri düzenliyor.",
      positiveVotes: 750,
      negativeVotes: 126,
      status: "Onay Bekliyor",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 5,
      title: "Kadın Hakları Yürüyüşü",
      location: "Ankara",
      category: "İnsan Hakları",
      startDate: "08.03.2023",
      participants: 5000,
      description: "Kadın hakları ve eşitlik için düzenlenen yıllık yürüyüş.",
      positiveVotes: 2100,
      negativeVotes: 245,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 6,
      title: "Dijital Haklar Farkındalığı",
      location: "Çevrimiçi/İstanbul",
      category: "Teknoloji",
      startDate: "12.09.2023",
      participants: 5000,
      description: "Dijital gizlilik hakları ve gözetlemeye karşı kampanya.",
      positiveVotes: 1000,
      negativeVotes: 123,
      status: "Aktif",
      image: "/placeholder.svg?height=200&width=400",
    }
  ];
}; 