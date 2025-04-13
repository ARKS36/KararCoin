// Firebase servislerini içe aktar
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// =============== BOYKOT İŞLEMLERİ ===============

// Tüm boykotları getir
export const getBoycotts = async () => {
  try {
    const boycottsCollection = collection(db, 'boycotts');
    const boycottSnapshot = await getDocs(boycottsCollection);
    const boycottList = boycottSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return boycottList;
  } catch (error) {
    console.error("Boykotları getirme hatası:", error);
    throw error;
  }
};

// Onay bekleyen boykotları getir
export const getPendingBoycotts = async () => {
  try {
    const boycottsRef = collection(db, 'boycotts');
    const q = query(boycottsRef, where("status", "==", "Onay Bekliyor"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Onay bekleyen boykotları getirme hatası:", error);
    throw error;
  }
};

// ID'ye göre boykot getir
export const getBoycottById = async (boycottId) => {
  try {
    const boycottRef = doc(db, 'boycotts', boycottId);
    const boycottDoc = await getDoc(boycottRef);
    
    if (boycottDoc.exists()) {
      return {
        id: boycottDoc.id,
        ...boycottDoc.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Boykot getirme hatası (ID: ${boycottId}):`, error);
    throw error;
  }
};

// Yeni boykot ekle
export const addBoycott = async (boycottData) => {
  try {
    // Eğer görsel dosyası varsa, storage'a yükle
    let imageUrl = boycottData.image;
    
    if (boycottData.imageFile) {
      const storageRef = ref(storage, `boycotts/${Date.now()}_${boycottData.imageFile.name}`);
      await uploadBytes(storageRef, boycottData.imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Firestore'a ekle
    const docRef = await addDoc(collection(db, 'boycotts'), {
      ...boycottData,
      image: imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Eklenen dokümanı getir
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...newDoc.data()
    };
  } catch (error) {
    console.error("Boykot ekleme hatası:", error);
    throw error;
  }
};

// Boykot güncelle
export const updateBoycott = async (boycottData) => {
  try {
    const boycottId = boycottData.id;
    const boycottRef = doc(db, 'boycotts', boycottId);
    
    // ID'yi çıkar ve verileri güncelle
    const { id, ...updateData } = boycottData;
    updateData.updatedAt = serverTimestamp();
    
    await updateDoc(boycottRef, updateData);
    return true;
  } catch (error) {
    console.error(`Boykot güncelleme hatası (ID: ${boycottData.id}):`, error);
    throw error;
  }
};

// Boykot sil
export const deleteBoycott = async (boycottId) => {
  try {
    await deleteDoc(doc(db, 'boycotts', boycottId));
    return true;
  } catch (error) {
    console.error(`Boykot silme hatası (ID: ${boycottId}):`, error);
    throw error;
  }
};

// Boykot onayla
export const approveBoycott = async (boycottId) => {
  try {
    const boycottRef = doc(db, 'boycotts', boycottId);
    await updateDoc(boycottRef, {
      status: "Aktif",
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Boykot onaylama hatası (ID: ${boycottId}):`, error);
    throw error;
  }
};

// Boykot reddet
export const rejectBoycott = async (boycottId) => {
  try {
    const boycottRef = doc(db, 'boycotts', boycottId);
    await updateDoc(boycottRef, {
      status: "Reddedildi",
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Boykot reddetme hatası (ID: ${boycottId}):`, error);
    throw error;
  }
};

// =============== PROTESTO İŞLEMLERİ ===============

// Tüm protestoları getir
export const getProtests = async () => {
  try {
    const protestsCollection = collection(db, 'protests');
    const protestSnapshot = await getDocs(protestsCollection);
    const protestList = protestSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return protestList;
  } catch (error) {
    console.error("Protestoları getirme hatası:", error);
    throw error;
  }
};

// Onay bekleyen protestoları getir
export const getPendingProtests = async () => {
  try {
    const protestsRef = collection(db, 'protests');
    const q = query(protestsRef, where("status", "==", "Onay Bekliyor"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Onay bekleyen protestoları getirme hatası:", error);
    throw error;
  }
};

// Yeni protesto ekle
export const addProtest = async (protestData) => {
  try {
    // Eğer görsel dosyası varsa, storage'a yükle
    let imageUrl = protestData.image;
    
    if (protestData.imageFile) {
      const storageRef = ref(storage, `protests/${Date.now()}_${protestData.imageFile.name}`);
      await uploadBytes(storageRef, protestData.imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Firestore'a ekle
    const docRef = await addDoc(collection(db, 'protests'), {
      ...protestData,
      image: imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Eklenen dokümanı getir
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...newDoc.data()
    };
  } catch (error) {
    console.error("Protesto ekleme hatası:", error);
    throw error;
  }
};

// Protesto güncelle
export const updateProtest = async (protestData) => {
  try {
    const protestId = protestData.id;
    const protestRef = doc(db, 'protests', protestId);
    
    // ID'yi çıkar ve verileri güncelle
    const { id, ...updateData } = protestData;
    updateData.updatedAt = serverTimestamp();
    
    await updateDoc(protestRef, updateData);
    return true;
  } catch (error) {
    console.error(`Protesto güncelleme hatası (ID: ${protestData.id}):`, error);
    throw error;
  }
};

// Protesto sil
export const deleteProtest = async (protestId) => {
  try {
    await deleteDoc(doc(db, 'protests', protestId));
    return true;
  } catch (error) {
    console.error(`Protesto silme hatası (ID: ${protestId}):`, error);
    throw error;
  }
};

// Protesto onayla
export const approveProtest = async (protestId) => {
  try {
    const protestRef = doc(db, 'protests', protestId);
    await updateDoc(protestRef, {
      status: "Aktif",
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Protesto onaylama hatası (ID: ${protestId}):`, error);
    throw error;
  }
};

// Protesto reddet
export const rejectProtest = async (protestId) => {
  try {
    const protestRef = doc(db, 'protests', protestId);
    await updateDoc(protestRef, {
      status: "Reddedildi",
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Protesto reddetme hatası (ID: ${protestId}):`, error);
    throw error;
  }
};

// =============== OY İŞLEMLERİ ===============

// Oy kaydet
export const saveVote = async (userId, itemId, itemType, voteType, voteCount) => {
  try {
    const voteData = {
      userId,
      itemId,
      itemType, // "boycott" veya "protest"
      voteType, // "positive" veya "negative"
      count: voteCount,
      timestamp: serverTimestamp()
    };
    
    // Kullanıcının daha önce oy kullanıp kullanmadığını kontrol et
    const votesRef = collection(db, 'votes');
    const q = query(
      votesRef, 
      where("userId", "==", userId),
      where("itemId", "==", itemId),
      where("itemType", "==", itemType)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Var olan oyu güncelle
      const voteDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'votes', voteDoc.id), {
        voteType,
        count: voteCount,
        timestamp: serverTimestamp()
      });
      return voteDoc.id;
    } else {
      // Yeni oy ekle
      const docRef = await addDoc(collection(db, 'votes'), voteData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Oy kaydetme hatası:", error);
    throw error;
  }
};

// Kullanıcının oylarını getir
export const getUserVotes = async (userId) => {
  try {
    const votesRef = collection(db, 'votes');
    const q = query(
      votesRef,
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Kullanıcı oylarını getirme hatası (UserID: ${userId}):`, error);
    throw error;
  }
};

// =============== ORTAK İŞLEMLER ===============

// Onay Bekleyen Tüm Öğeleri Getir
export const getPendingApprovals = async () => {
  try {
    // Onay bekleyen boykotları getir
    const pendingBoycotts = await getPendingBoycotts();
    
    // Onay bekleyen protestoları getir
    const pendingProtests = await getPendingProtests();
    
    // Her birine tür ekle
    const boycottsWithType = pendingBoycotts.map(item => ({
      ...item,
      type: 'boycott'
    }));
    
    const protestsWithType = pendingProtests.map(item => ({
      ...item,
      type: 'protest'
    }));
    
    // Birleştir ve döndür
    return [...boycottsWithType, ...protestsWithType];
  } catch (error) {
    console.error("Onay bekleyen öğeleri getirme hatası:", error);
    throw error;
  }
}; 