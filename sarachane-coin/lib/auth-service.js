// Firebase authentication servisleri
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';

// KULLANICI KAYIT İŞLEMİ
export const registerUser = async (email, password, displayName, walletAddress) => {
  try {
    // Firebase Auth ile kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcı görünen adını ayarla
    await updateProfile(user, {
      displayName: displayName
    });
    
    // Kullanıcı bilgilerini Firestore'a kaydet
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      displayName: displayName,
      walletAddress: walletAddress || null,
      role: 'user',
      verified: false,
      balance: 0,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error("Kullanıcı kayıt hatası:", error);
    throw error;
  }
};

// KULLANICI GİRİŞ İŞLEMİ
export const loginUser = async (email, password) => {
  try {
    // Firebase Auth ile giriş
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Son giriş zamanını güncelle
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error("Giriş hatası:", error);
    throw error;
  }
};

// ÇIKIŞ İŞLEMİ
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Çıkış hatası:", error);
    throw error;
  }
};

// ŞİFRE SIFIRLAMA
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    throw error;
  }
};

// CÜZDAN BAĞLAMA
export const linkWalletToUser = async (userId, walletAddress) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      walletAddress: walletAddress,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Cüzdan bağlama hatası:", error);
    throw error;
  }
};

// KULLANICI BİLGİLERİNİ GETİR
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Kullanıcı bilgilerini getirme hatası (ID: ${userId}):`, error);
    throw error;
  }
};

// KULLANICI DOĞRULAMA DURUMUNU GÜNCELLE
export const verifyUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      verified: true,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Kullanıcı doğrulama hatası (ID: ${userId}):`, error);
    throw error;
  }
};

// KULLANICI BAKİYESİNİ GÜNCELLE
export const updateUserBalance = async (userId, newBalance) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      balance: newBalance,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Bakiye güncelleme hatası (ID: ${userId}):`, error);
    throw error;
  }
};

// MEVCUT KULLANICI DURUMU DİNLEME
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Kullanıcı oturum açmışsa, Firestore'dan ek bilgileri al
      try {
        const userProfile = await getUserProfile(user.uid);
        callback({ ...user, profile: userProfile });
      } catch (error) {
        console.error("Kullanıcı profili alma hatası:", error);
        callback(user);
      }
    } else {
      callback(null);
    }
  });
}; 