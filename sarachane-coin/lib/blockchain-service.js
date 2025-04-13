// Ethereum ve Karar Coin kontrat entegrasyonu
import { ethers } from 'ethers';
import KararCoinABI from '../contracts/KararCoin.json';
import { updateUserBalance } from './auth-service';

// Contract adresi (gerçek adresle değiştirilmelidir)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KARAR_COIN_ADDRESS || '0xYourDeployedContractAddress';

// Provider ve Signer nesnesini oluştur
const getProviderAndSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // MetaMask veya başka bir cüzdan sağlayıcıya bağlan
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      return { provider, signer };
    } catch (error) {
      console.error("Cüzdan bağlantı hatası:", error);
      throw new Error("Cüzdan bağlantısı sağlanamadı. Lütfen MetaMask'ı kontrol edin.");
    }
  } else {
    throw new Error("Web3 cüzdanı bulunamadı. Lütfen MetaMask yükleyin.");
  }
};

// Karar Coin kontratı örneği oluştur
export const getKararCoinContract = async () => {
  try {
    const { signer } = await getProviderAndSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, KararCoinABI.abi, signer);
  } catch (error) {
    console.error("Kontrat oluşturma hatası:", error);
    throw error;
  }
};

// Cüzdan bağlantısı
export const connectWallet = async () => {
  try {
    const { provider, signer } = await getProviderAndSigner();
    const address = await signer.getAddress();
    
    // Bakiyeyi al
    const contract = await getKararCoinContract();
    const balanceBN = await contract.balanceOf(address);
    const balance = ethers.utils.formatUnits(balanceBN, 18);
    
    return {
      address,
      balance,
      chainId: (await provider.getNetwork()).chainId
    };
  } catch (error) {
    console.error("Cüzdan bağlama hatası:", error);
    throw error;
  }
};

// Bakiye sorgulama
export const getBalance = async (address) => {
  try {
    const contract = await getKararCoinContract();
    const balanceBN = await contract.balanceOf(address);
    return ethers.utils.formatUnits(balanceBN, 18);
  } catch (error) {
    console.error("Bakiye sorgulama hatası:", error);
    throw error;
  }
};

// Token gönderme
export const transferTokens = async (toAddress, amount) => {
  try {
    const contract = await getKararCoinContract();
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
    
    const tx = await contract.transfer(toAddress, amountInWei);
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error("Token gönderme hatası:", error);
    throw error;
  }
};

// Oy için token kullanma
export const useTokensForVoting = async (itemId, isProtest, amount) => {
  try {
    const contract = await getKararCoinContract();
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
    
    const tx = await contract.useTokensForVoting(itemId, isProtest, amountInWei);
    await tx.wait();
    
    // Kullanıcı bakiyesini güncelle (Firestore)
    const { signer } = await getProviderAndSigner();
    const address = await signer.getAddress();
    const newBalance = await getBalance(address);
    
    // Eğer kullanıcı kimliği ve UID bilgisi varsa Firestore'da güncelle
    // Bu kısmı kendi uygulamanıza göre düzenleyin
    if (window.currentUser && window.currentUser.uid) {
      await updateUserBalance(window.currentUser.uid, newBalance);
    }
    
    return {
      success: true,
      txHash: tx.hash,
      newBalance
    };
  } catch (error) {
    console.error("Oy verme hatası:", error);
    throw error;
  }
};

// Yeni protesto kaydetme
export const registerProtest = async (protestId, creator) => {
  try {
    const contract = await getKararCoinContract();
    const tx = await contract.registerProtest(protestId, creator);
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error("Protesto kaydetme hatası:", error);
    throw error;
  }
};

// Yeni boykot kaydetme
export const registerBoycott = async (boycottId, creator) => {
  try {
    const contract = await getKararCoinContract();
    const tx = await contract.registerBoycott(boycottId, creator);
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error("Boykot kaydetme hatası:", error);
    throw error;
  }
};

// Kullanıcı doğrulama
export const verifyAccount = async (account) => {
  try {
    const contract = await getKararCoinContract();
    
    // Sadece kontrat sahibi bu işlemi yapabilir
    const tx = await contract.verifyAccount(account);
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error("Kullanıcı doğrulama hatası:", error);
    throw error;
  }
};

// Token basma (mint) - Sadece kontrat sahibi yapabilir
export const mintTokens = async (toAddress, amount) => {
  try {
    const contract = await getKararCoinContract();
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
    
    const tx = await contract.mint(toAddress, amountInWei);
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error("Token basma hatası:", error);
    throw error;
  }
}; 