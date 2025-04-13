'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FiUsers, FiMapPin, FiCalendar, FiCheck, FiArrowLeft, 
  FiThumbsUp, FiThumbsDown, FiMessageCircle, FiSend,
  FiShare2, FiClock, FiUser
} from 'react-icons/fi'
import { useRouter } from 'next/navigation'

// Örnek veri
const boycott = {
  id: 1,
  title: 'Adalet Zinciri Protestosu',
  date: '2024-08-15',
  location: 'İstanbul, Saraçhane',
  description: 'Adalet sistemindeki eksikliklere dikkat çekmek ve reform talep etmek için düzenlenen geniş katılımlı bir protesto eylemi. Protestocular, sistemdeki adaletsizliklere karşı seslerini yükseltmek ve somut değişiklikler talep etmek için bir araya geliyor.',
  category: "Politik",
  supporters: 18452,
  verified: true,
  organizer: "Adalet İçin Sivil İnisiyatif",
  demands: [
    "Yargı bağımsızlığının güçlendirilmesi",
    "Adil yargılanma hakkının korunması",
    "Hukuk sisteminde şeffaflığın artırılması",
    "Adalet sistemindeki gecikmelerle mücadele edilmesi",
    "Hukuk eğitiminin kalitesinin yükseltilmesi"
  ],
  longDescription: `Adalet Zinciri Protestosu, Türkiye'nin adalet sistemindeki yapısal sorunlara dikkat çekmek ve reform talep etmek amacıyla organize edilmiş geniş tabanlı bir sivil harekettir.
  
  Bu protestonun temel amacı, adalet sistemindeki adaletsizliklere ve eksikliklere karşı farkındalık oluşturmak, yargı bağımsızlığını güçlendirmek ve hukukun üstünlüğünü sağlamak için somut adımlar atılmasını talep etmektir.
  
  Protestocular, yargı süreçlerindeki gecikmelere, hukuki belirsizliklere, adil yargılanma hakkının ihlaline ve yargı sistemindeki diğer yapısal sorunlara dikkat çekmek istemektedir.
  
  Hareket, geniş bir sivil toplum koalisyonu tarafından desteklenmekte ve çeşitli meslek gruplarından insanları bir araya getirmektedir. Avukatlar, akademisyenler, öğrenciler, aktivistler ve vatandaşların geniş katılımıyla gerçekleşen protestolarda, barışçıl gösteriler, seminerler, paneller ve sosyal medya kampanyaları düzenlenmektedir.`,
  image: "/images/protests/protest1.jpg",
  gallery: [
    "/images/protests/protest1.jpg",
    "/images/protests/detail1.jpg",
    "/images/protests/detail2.jpg",
    "/images/protests/detail3.jpg"
  ]
};

// Örnek yorumlar
const initialComments = [
  {
    id: 1,
    user: "Ahmet Yılmaz",
    avatar: "/images/avatars/user1.jpg",
    text: "Bu protestoya ben de katılmıştım, gerçekten etkileyici bir kalabalık vardı. Taleplerimizi barışçıl bir şekilde dile getirdik.",
    date: "2024-08-16T12:30:00",
    likes: 24
  },
  {
    id: 2,
    user: "Ayşe Kaya",
    avatar: "/images/avatars/user2.jpg",
    text: "Adalet sistemindeki sorunlar artık görmezden gelinemez. Bu tür protestolar farkındalığı artırmak için çok önemli.",
    date: "2024-08-16T14:45:00",
    likes: 17
  },
  {
    id: 3,
    user: "Mehmet Demir",
    avatar: "/images/avatars/user3.jpg",
    text: "Organizasyon çok iyiydi, her şey barışçıl ve düzenliydi. Umarım sesimiz duyulur ve gerekli değişiklikler yapılır.",
    date: "2024-08-17T09:20:00",
    likes: 9
  }
];

export default function BoycottDetail() {
  const router = useRouter();
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [yesCount, setYesCount] = useState(15624);
  const [noCount, setNoCount] = useState(2828);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(initialComments);
  const [activeImage, setActiveImage] = useState(boycott.image);

  const handleVote = (voteType: 'yes' | 'no') => {
    if (vote === voteType) {
      // Oyu geri çek
      setVote(null);
      if (voteType === 'yes') {
        setYesCount(prev => prev - 1);
      } else {
        setNoCount(prev => prev - 1);
      }
    } else {
      // Önceki oyu değiştir veya yeni oy ver
      if (vote === 'yes' && voteType === 'no') {
        setYesCount(prev => prev - 1);
        setNoCount(prev => prev + 1);
      } else if (vote === 'no' && voteType === 'yes') {
        setNoCount(prev => prev - 1);
        setYesCount(prev => prev + 1);
      } else if (voteType === 'yes') {
        setYesCount(prev => prev + 1);
      } else {
        setNoCount(prev => prev + 1);
      }
      setVote(voteType);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim() === '') return;
    
    const newComment = {
      id: comments.length + 1,
      user: "Siz",
      avatar: "/images/avatars/default.jpg",
      text: commentText,
      date: new Date().toISOString(),
      likes: 0
    };
    
    setComments(prev => [newComment, ...prev]);
    setCommentText('');
  };

  const totalVotes = yesCount + noCount;
  const yesPercentage = totalVotes > 0 ? Math.round((yesCount / totalVotes) * 100) : 0;
  const noPercentage = totalVotes > 0 ? Math.round((noCount / totalVotes) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Geri Butonu */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            <span>Geri dön</span>
          </button>
        </div>
        
        {/* Başlık Bölümü */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {boycott.verified && (
            <div className="badge-green inline-flex items-center gap-1 mb-4">
              <FiCheck size={12} />
              <span>Doğrulanmış Boykot</span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{boycott.title}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-gray-400">
            <div className="flex items-center gap-1">
              <FiMapPin />
              <span>{boycott.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar />
              <span>{new Date(boycott.date).toLocaleDateString('tr-TR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiUsers />
              <span>{boycott.supporters.toLocaleString()} destekçi</span>
            </div>
          </div>
        </div>
        
        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sütun - Resimler ve Detaylar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Büyük Resim */}
            <div className="relative w-full h-96 rounded-xl overflow-hidden">
              <Image 
                src={activeImage}
                alt={boycott.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className="badge-red px-3 py-1">
                  {boycott.category}
                </div>
              </div>
            </div>
            
            {/* Küçük Resimler */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {boycott.gallery.map((img, index) => (
                <motion.div 
                  key={index} 
                  className={`relative min-w-[100px] h-20 rounded-lg overflow-hidden cursor-pointer ${activeImage === img ? 'ring-2 ring-red-500' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveImage(img)}
                >
                  <Image 
                    src={img}
                    alt={`${boycott.title} görsel ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Açıklama */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Hakkında</h2>
              <div className="text-gray-300 space-y-4 whitespace-pre-line">
                {boycott.longDescription}
              </div>
            </div>
            
            {/* Talepler */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Talepler</h2>
              <ul className="space-y-3">
                {boycott.demands.map((demand, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="min-w-6 h-6 flex items-center justify-center bg-red-600/20 rounded-full text-red-500 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-300">{demand}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Yorumlar */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Yorumlar</h2>
                <div className="flex items-center gap-1 text-gray-400">
                  <FiMessageCircle />
                  <span>{comments.length}</span>
                </div>
              </div>
              
              {/* Yorum Formu */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex gap-4">
                  <div className="min-w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-red-500">
                    <FiUser />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Yorumunuzu yazın..."
                      className="fancy-input w-full min-h-20 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <motion.button
                        type="submit"
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span>Yorum Yap</span>
                        <FiSend />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
              
              {/* Yorum Listesi */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="min-w-10 h-10 relative rounded-full overflow-hidden">
                      <Image 
                        src={comment.avatar}
                        alt={comment.user}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{comment.user}</span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <FiClock size={14} />
                          {new Date(comment.date).toLocaleDateString('tr-TR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-2">{comment.text}</p>
                      <div className="mt-2 flex gap-4">
                        <button className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm">
                          <FiThumbsUp size={14} />
                          <span>Beğen ({comment.likes})</span>
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors text-sm">
                          Yanıtla
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sağ Sütun - Oylama ve Bilgiler */}
          <div className="space-y-8">
            {/* Oylama Paneli */}
            <div className="glass-card p-6 rounded-xl sticky top-20">
              <h2 className="text-xl font-bold mb-4">Bu boykotu destekliyor musunuz?</h2>
              
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={() => handleVote('yes')}
                  className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    vote === 'yes' 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                      : 'bg-gradient-to-r from-red-800/40 to-red-700/40 hover:from-red-700 hover:to-red-600 text-white'
                  }`}
                >
                  <FiThumbsUp />
                  <span>Evet</span>
                </button>
                <button 
                  onClick={() => handleVote('no')}
                  className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    vote === 'no' 
                      ? 'bg-[#333] text-white' 
                      : 'bg-[#222] hover:bg-[#333] text-white'
                  }`}
                >
                  <FiThumbsDown />
                  <span>Hayır</span>
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Evet</span>
                  <span>{yesPercentage}% ({yesCount.toLocaleString()})</span>
                </div>
                <div className="w-full h-3 bg-[#222] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-500" 
                    initial={{ width: `${yesPercentage}%` }}
                    animate={{ width: `${yesPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="flex justify-between text-sm mb-1">
                  <span>Hayır</span>
                  <span>{noPercentage}% ({noCount.toLocaleString()})</span>
                </div>
                <div className="w-full h-3 bg-[#222] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#333]" 
                    initial={{ width: `${noPercentage}%` }}
                    animate={{ width: `${noPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="text-center mt-4 text-gray-400 text-sm">
                  Toplam {(yesCount + noCount).toLocaleString()} oy
                </div>
              </div>
              
              <div className="border-t border-[#222] mt-6 pt-6">
                <button className="w-full py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg flex items-center justify-center gap-2 transition-all">
                  <FiShare2 />
                  <span>Paylaş</span>
                </button>
              </div>
            </div>
            
            {/* Organizatör Bilgisi */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Organizatör</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#222] rounded-full flex items-center justify-center text-red-500">
                  <FiUsers size={24} />
                </div>
                <div>
                  <div className="font-bold">{boycott.organizer}</div>
                  <div className="text-gray-400 text-sm">Organize eden</div>
                </div>
              </div>
              <Link href="/organizers/adalet-icin-sivil-inisiyatif">
                <motion.button 
                  className="w-full mt-4 button-outline py-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Profili Görüntüle
                </motion.button>
              </Link>
            </div>
            
            {/* Diğer Boykotlar */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Benzer Boykotlar</h2>
              <div className="space-y-4">
                <Link href="/boycotts/2">
                  <div className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <Image 
                          src="/images/protests/protest2.jpg"
                          alt="İnternet Özgürlüğü İnisiyatifi"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">İnternet Özgürlüğü İnisiyatifi</div>
                        <div className="text-gray-400 text-sm flex items-center gap-1">
                          <FiMapPin size={12} />
                          <span>Ankara, Kızılay</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/boycotts/3">
                  <div className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <Image 
                          src="/images/protests/protest3.jpg"
                          alt="Demokratik Eğitim Hareketi"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Demokratik Eğitim Hareketi</div>
                        <div className="text-gray-400 text-sm flex items-center gap-1">
                          <FiMapPin size={12} />
                          <span>İzmir, Konak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/boycotts">
                  <motion.button 
                    className="w-full mt-2 button-outline py-2 text-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Tüm Boykotları Görüntüle
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 