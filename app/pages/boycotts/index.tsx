'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FiFilter, FiSearch, FiCalendar, FiMapPin, FiCheck, FiUser, 
  FiChevronDown, FiChevronRight, FiThumbsUp, FiThumbsDown,
  FiArrowRight, FiX, FiSliders
} from 'react-icons/fi'

// Protesto ve Boykot Verileri
const protests = [
  {
    id: 1, 
    title: 'Adalet Zinciri Protestosu', 
    date: '2024-08-15', 
    location: 'İstanbul, Saraçhane', 
    description: 'Adalet sistemindeki eksikliklere dikkat çekmek ve reform talep etmek için düzenlenen geniş katılımlı bir protesto eylemi.',
    category: "Politik",
    supporters: 18452,
    verified: true,
    image: "/images/protests/protest1.jpg"
  },
  {
    id: 2, 
    title: 'İnternet Özgürlüğü İnisiyatifi', 
    date: '2024-08-28', 
    location: 'Ankara, Kızılay', 
    description: 'İnternet sansürüne ve dijital gözetim uygulamalarına karşı düzenlenen bir boykot ve farkındalık kampanyası.',
    category: "Dijital Haklar",
    supporters: 12304,
    verified: true,
    image: "/images/protests/protest2.jpg"
  },
  {
    id: 3, 
    title: 'Demokratik Eğitim Hareketi', 
    date: '2024-09-10', 
    location: 'İzmir, Konak', 
    description: 'Eğitim sisteminde eşitliği ve erişilebilirliği savunmak için başlatılan geniş kapsamlı bir hareket.',
    category: "Eğitim",
    supporters: 9870,
    verified: false,
    image: "/images/protests/protest3.jpg"
  },
  {
    id: 4, 
    title: 'Çevre Koruma Protestosu', 
    date: '2024-10-05', 
    location: 'Bursa, Nilüfer', 
    description: 'Doğal alanların korunması ve sürdürülebilir enerji kaynaklarının teşvik edilmesi için düzenlenen bir çevre protestosu.',
    category: "Çevre",
    supporters: 7520,
    verified: true,
    image: "/images/protests/protest4.jpg"
  },
  {
    id: 5, 
    title: 'Veri Gizliliği Boykotu', 
    date: '2024-09-25', 
    location: 'Online', 
    description: 'Kişisel veri toplama ve işleme pratiklerini protesto etmek için düzenlenen bir sosyal medya boykotu.',
    category: "Teknoloji",
    supporters: 21350,
    verified: true,
    image: "/images/protests/protest5.jpg"
  },
  {
    id: 6, 
    title: 'Yerel Esnaf Destek Hareketi', 
    date: '2024-11-15', 
    location: 'Eskişehir, Merkez', 
    description: 'Küçük işletmeleri ve yerel esnafı desteklemek amacıyla başlatılan ekonomik direniş kampanyası.',
    category: "Ekonomi",
    supporters: 5430,
    verified: false,
    image: "/images/protests/protest6.jpg"
  },
];

// Kategori filtreleri
const categories = [
  "Tümü",
  "Politik",
  "Dijital Haklar",
  "Eğitim",
  "Çevre",
  "Teknoloji",
  "Ekonomi"
];

export default function BoycottsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [filteredProtests, setFilteredProtests] = useState(protests);
  const [votes, setVotes] = useState<Record<number, { yes: number, no: number }>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Oylama yapma fonksiyonu
  const handleVote = (id: number, voteType: 'yes' | 'no') => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [id]: { 
        yes: prevVotes[id]?.yes || 0, 
        no: prevVotes[id]?.no || 0,
        [voteType]: (prevVotes[id]?.[voteType] || 0) + 1 
      },
    }));
  };

  // Filtreleme işlemi
  useEffect(() => {
    let results = protests;
    
    // Kategori filtresi
    if (selectedCategory !== 'Tümü') {
      results = results.filter(protest => protest.category === selectedCategory);
    }
    
    // Arama filtresi
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(protest => 
        protest.title.toLowerCase().includes(query) || 
        protest.description.toLowerCase().includes(query) ||
        protest.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredProtests(results);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Protestolar</span> ve Boykotlar
          </h1>
          <p className="text-xl text-gray-300">
            Türkiye'deki protesto ve boykotlar hakkında bilgi edin, destekleyin ve oylama yapın!
          </p>
        </div>
        
        {/* Arama ve Filtreleme Alanı */}
        <div className="bg-[#111] p-5 rounded-xl mb-10 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Protestoları ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="fancy-input w-full pr-10"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="bg-[#222] hover:bg-[#333] text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-all"
              >
                <FiFilter />
                <span>Filtrele</span>
                <FiChevronDown className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg z-10"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-gray-400 font-medium text-sm">Kategoriler</div>
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-[#333] transition-colors flex items-center justify-between ${
                          selectedCategory === category ? 'text-red-500' : 'text-gray-200'
                        }`}
                      >
                        {category}
                        {selectedCategory === category && <FiCheck size={16} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            <Link href="/boycotts/create">
              <motion.button 
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-red-900/20"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Boykot Oluştur</span>
                <FiArrowRight />
              </motion.button>
            </Link>
          </div>
        </div>
        
        {/* Filtre bilgisi */}
        {(selectedCategory !== 'Tümü' || searchQuery.trim() !== '') && (
          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <FiSliders size={16} />
            <span>Aktif filtreler:</span>
            
            {selectedCategory !== 'Tümü' && (
              <div className="badge-red flex items-center gap-1 ml-2">
                <span>{selectedCategory}</span>
                <button onClick={() => setSelectedCategory('Tümü')}>
                  <FiX size={14} />
                </button>
              </div>
            )}
            
            {searchQuery.trim() !== '' && (
              <div className="badge-blue flex items-center gap-1 ml-2">
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')}>
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Protestolar Listesi */}
        {filteredProtests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProtests.map((protest) => (
              <motion.div
                key={protest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-xl overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={protest.image} 
                    alt={protest.title}
                    width={400}
                    height={200}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="badge-red">
                      {protest.category}
                    </div>
                  </div>
                  {protest.verified && (
                    <div className="absolute top-3 left-3">
                      <div className="badge-green flex items-center gap-1">
                        <FiCheck size={12} />
                        <span>Doğrulanmış</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">{protest.title}</h3>
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiUser className="text-red-500" />
                      <span>{protest.supporters.toLocaleString()} destekçi</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiMapPin className="text-red-500" />
                      <span>{protest.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiCalendar className="text-red-500" />
                      <span>{new Date(protest.date).toLocaleDateString('tr-TR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-300 text-sm line-clamp-3">{protest.description}</p>
                  </div>
                  
                  <div className="mt-4 p-3 bg-[#111] rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Bu boykotu destekliyor musunuz?</span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleVote(protest.id, 'yes')}
                        className="flex-1 bg-gradient-to-r from-red-800/40 to-red-700/40 hover:from-red-700 hover:to-red-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 transition-all"
                      >
                        <FiThumbsUp />
                        <span>Evet</span>
                      </button>
                      <button 
                        onClick={() => handleVote(protest.id, 'no')}
                        className="flex-1 bg-[#222] hover:bg-[#333] text-white rounded-lg py-2 flex items-center justify-center gap-2 transition-all"
                      >
                        <FiThumbsDown />
                        <span>Hayır</span>
                      </button>
                    </div>
                    
                    {votes[protest.id] && (
                      <div className="mt-3 pt-3 border-t border-[#222] grid grid-cols-2 gap-2 text-center">
                        <div>
                          <div className="text-gray-400 text-xs">Evet</div>
                          <div className="text-white font-bold">{votes[protest.id].yes || 0}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs">Hayır</div>
                          <div className="text-white font-bold">{votes[protest.id].no || 0}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <Link href={`/boycotts/${protest.id}`}>
                      <motion.button 
                        className="button-outline w-full py-2 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span>Detayları Görüntüle</span>
                        <FiArrowRight />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="fancy-card p-10 text-center">
            <h3 className="text-2xl font-bold mb-3">Sonuç Bulunamadı</h3>
            <p className="text-gray-400">Arama kriterlerinize uygun boykot veya protesto bulunamadı.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tümü');
              }}
              className="mt-4 px-4 py-2 bg-[#222] hover:bg-[#333] rounded-lg text-white transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 