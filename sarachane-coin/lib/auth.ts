// Admin kimlik bilgileri
export const ADMIN_CREDENTIALS = {
  username: "Armanch",
  password: "Arminius_123"
};

// Basit kimlik doğrulama fonksiyonu
export const verifyAdminCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

// Admin oturum durumunu localStorage'dan kontrol et
export const isAdminLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const authToken = localStorage.getItem('admin_auth_token');
  return authToken === 'admin_authenticated';
};

// Admin oturumunu başlat
export const loginAdmin = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_auth_token', 'admin_authenticated');
};

// Admin oturumunu sonlandır
export const logoutAdmin = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_auth_token');
}; 