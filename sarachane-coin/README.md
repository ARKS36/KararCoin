# Saraçhane Coin - Merkeziyetsiz Bilinçlendirme Platformu

Saraçhane Coin, sansüre takılmayan, toplumsal farkındalığı artıran, blockchain destekli bir bilinçlendirme platformudur. Platform, kullanıcıların özgürce bilgi paylaşmasını ve topluluk tarafından doğrulanmasını sağlar.

## 🌟 Özellikler

- **Merkeziyetsiz Bilgi Yayılımı**: İçerikler IPFS üzerinde saklanır
- **Web3 Cüzdan Entegrasyonu**: MetaMask ve WalletConnect desteği
- **Sansür Direnci**: İçerikler merkeziyetsiz ağda barındırılır
- **DAO Tabanlı Moderasyon**: Topluluk yönetişimi
- **Token Ekonomisi**: İçerik üreticileri ve doğrulayıcılar için ödül sistemi

## 🚀 Teknoloji Yığını

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum (Polygon L2)
- **Depolama**: IPFS
- **Akıllı Kontratlar**: Solidity
- **Web3 Entegrasyonu**: ethers.js

## 🛠 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/sarachane-coin.git
cd sarachane-coin
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Gerekli ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env.local
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 💡 Token Ekonomisi

### SRC Token
- **Toplam Arz**: 1,000,000 SRC
- **Kullanım Alanları**:
  - İçerik yayınlama (100 SRC stake)
  - İçerik doğrulama (50 SRC stake)
  - DAO yönetişimine katılım
  - Platform kararlarında oy kullanma

### Ödüller
- İçerik Üreticileri: 10 SRC / doğrulanmış içerik
- Doğrulayıcılar: 5 SRC / doğrulama

## 🏛 DAO Yönetişimi

- Minimum Token Gerekliliği: 100 SRC
- Oylama Süresi: 1 hafta
- Quorum: %4
- Öneriler için minimum token: 100 SRC

## 🔒 Güvenlik

- Akıllı kontratlar OpenZeppelin kütüphanesi kullanılarak geliştirilmiştir
- DAO yönetişimi için Governor kontratı kullanılmaktadır
- İçerik doğrulama için çoklu imza mekanizması

## 🤝 Katkıda Bulunma

1. Bu repoyu forklayın
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- Website: [sarachanecoin.com](https://sarachanecoin.com)
- Twitter: [@SarachaneCoin](https://twitter.com/SarachaneCoin)
