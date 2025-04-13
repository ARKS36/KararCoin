import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, GitlabIcon as GitHub } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image 
                src="/images/logo.png" 
                alt="Karar Coin Logo" 
                width={48} 
                height={48} 
                className="mr-3 rounded-full bg-white p-1 shadow-md"
              />
              <h3 className="text-xl font-bold">Karar Coin</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Türkiye'deki protestolar ve boykotlar hakkında bilgi sağlamaya adanmış, toplumsal hareketleri destekleyen
              bir platform.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <GitHub className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/protests" className="text-gray-400 hover:text-white transition-colors">
                  Protestolar
                </Link>
              </li>
              <li>
                <Link href="/boycotts" className="text-gray-400 hover:text-white transition-colors">
                  Boykotlar
                </Link>
              </li>
              <li>
                <Link href="/token" className="text-gray-400 hover:text-white transition-colors">
                  Karar Coin
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <a href="mailto:kararcoiniletisim@outlook.com" className="text-gray-400 hover:text-white transition-colors">
                  İletişim: kararcoiniletisim@outlook.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kaynaklar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  SSS
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-gray-400 hover:text-white transition-colors">
                  Teknik Döküman
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">
                  Dokümantasyon
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Abone Ol</h3>
            <p className="text-gray-400 mb-4">
              En son protestolar, boykotlar ve platform haberleri hakkında güncel kalın.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-md transition-colors">
                Abone Ol
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Karar Coin. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/legal" className="text-gray-400 hover:text-white text-sm transition-colors">
              Yasal
            </Link>
            <a 
              href="mailto:kararcoiniletisim@outlook.com" 
              className="text-gray-400 hover:text-white text-sm transition-colors flex items-center"
            >
              <span className="mr-1">İletişim</span>
              <span className="text-red-400">✉</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

