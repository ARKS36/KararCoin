// Types for admin panel and data

// Boycott type
export interface Boycott {
  id: number;
  title: string;
  description: string;
  target: string;
  category: string;
  startDate: string;
  endDate?: string;
  status: "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi";
  creator?: string;
  participants: number;
  positiveVotes: number;
  negativeVotes: number;
  image?: string;
  tags?: string[];
}

// Protest type
export interface Protest {
  id: number;
  title: string;
  description: string;
  location?: string;
  category: string;
  startDate: string;
  endDate?: string;
  status: "Aktif" | "Onay Bekliyor" | "Reddedildi" | "Sona Erdi";
  creator?: string;
  participants: number;
  positiveVotes: number;
  negativeVotes: number;
  image?: string;
  tags?: string[];
}

// User activity type
export interface UserActivity {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

// Pending approval type
export interface PendingApproval {
  id: number;
  type: "Boykot" | "Protesto";
  title: string;
  requester: string;
  date: string;
  itemData: Boycott | Protest;
}

// Event item type
export interface EventItem {
  id: number;
  type: "Boykot" | "Protesto";
  title: string;
  location: string;
  date: string;
  participants: number;
  itemData: Boycott | Protest;
}

// Statistics type
export interface AdminStats {
  totalBoycotts: number;
  totalProtests: number;
  totalVisits: number;
  totalTokenTransactions: number;
  boycottChange: string;
  protestChange: string;
  visitChange: string;
  tokenChange: string;
}

// Theme mode
export type ThemeMode = "light" | "dark";

export interface User {
  id: number;
  username: string;
  walletAddress: string;
  tokenBalance: number;
  joinDate: Date;
  avatar?: string;
  email?: string;
  role?: "user" | "admin" | "moderator";
}

// Add UserVote type
export interface UserVote {
  itemType: "Boykot" | "Protesto";
  itemId: number;
  voteType: "positive" | "negative";
  voteCount: number;
  timestamp: string;
}

// Boykot kategorileri
export type BoycottBrandCategory = 
  | "Tüketim" 
  | "Teknoloji" 
  | "Market" 
  | "Akaryakıt" 
  | "Eğlence" 
  | "Medya" 
  | "Mobilya";

export type BoycottCelebrityCategory = 
  | "Oyuncular" 
  | "Müzisyenler" 
  | "Fenomenler" 
  | "Tasarımcılar" 
  | "Sporcular" 
  | "Politikacılar" 
  | "Medya Kişilikleri";

export type BoycottCategory = 
  | BoycottBrandCategory 
  | BoycottCelebrityCategory 
  | "Diğer"; 