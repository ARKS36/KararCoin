"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Wallet, LogOut } from "lucide-react"
import { useBlockchain } from "@/app/providers"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  // Blockchain context'inden cüzdan durumunu al
  const { address, balance, connectWallet, disconnectWallet, isConnecting } = useBlockchain()

  // Sayfa kaydırma durumuna göre header'ı güncelle
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Menüyü açıp kapatma
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Arama işlemi
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      alert("Lütfen bir arama terimi girin")
      return
    }
    
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-md py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-red-600 font-bold text-3xl">Karar</span>
          <span className="text-gray-700 font-bold text-3xl">Coin</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-red-600 font-medium transition duration-300"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/protests"
            className="text-gray-700 hover:text-red-600 font-medium transition duration-300"
          >
            Protestolar
          </Link>
          <Link
            href="/boycotts"
            className="text-gray-700 hover:text-red-600 font-medium transition duration-300"
          >
            Boykotlar
          </Link>
          <Link
            href="/token"
            className="text-gray-700 hover:text-red-600 font-medium transition duration-300"
          >
            Token
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-red-600 font-medium transition duration-300"
          >
            Hakkında
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {/* Arama kutusu */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Arama..."
              className="py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-48 transition-all duration-300 hover:w-64 focus:w-64 text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Aramak istediğiniz kelimeyi yazın"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition duration-300"
              aria-label="Ara"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Cüzdan Butonları */}
          {!address ? (
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 flex items-center space-x-2 transition duration-300 transform hover:scale-105"
            >
              <Wallet className="h-4 w-4" />
              <span className="text-white">{isConnecting ? "Bağlanıyor..." : "Cüzdan Bağla"}</span>
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm">
                <Wallet className="h-4 w-4 mr-2 text-red-600" />
                <span className="mr-1 text-gray-900">Bakiye:</span>
                <span className="font-bold text-gray-900">{balance}</span>
              </div>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 rounded-full px-4 py-2 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-red-600">Çıkış</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-red-600 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Menü"
        >
          {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 overflow-hidden ${
          isMenuOpen ? "max-h-[1000px] py-4" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Arama..."
              className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Aramak istediğiniz kelimeyi yazın"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition duration-300"
              aria-label="Ara"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-red-600 font-medium transition duration-300 flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Ana Sayfa</span>
              <ChevronDown className="h-5 w-5 transform -rotate-90" />
            </Link>
            <Link
              href="/protests"
              className="text-gray-700 hover:text-red-600 font-medium transition duration-300 flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Protestolar</span>
              <ChevronDown className="h-5 w-5 transform -rotate-90" />
            </Link>
            <Link
              href="/boycotts"
              className="text-gray-700 hover:text-red-600 font-medium transition duration-300 flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Boykotlar</span>
              <ChevronDown className="h-5 w-5 transform -rotate-90" />
            </Link>
            <Link
              href="/token"
              className="text-gray-700 hover:text-red-600 font-medium transition duration-300 flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Token</span>
              <ChevronDown className="h-5 w-5 transform -rotate-90" />
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-red-600 font-medium transition duration-300 flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Hakkında</span>
              <ChevronDown className="h-5 w-5 transform -rotate-90" />
            </Link>
          </nav>

          {/* Mobil Cüzdan Butonları */}
          {!address ? (
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full py-3 flex items-center justify-center space-x-2 transition duration-300 transform hover:scale-105 w-full"
            >
              <Wallet className="h-5 w-5" />
              <span className="font-medium text-white">{isConnecting ? "Bağlanıyor..." : "Cüzdan Bağla"}</span>
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-3">
                <div className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2 text-red-600" />
                  <span className="text-gray-900">Bakiye:</span>
                </div>
                <span className="font-bold text-gray-900">{balance} Karar Coin</span>
              </div>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 rounded-full py-3 flex items-center justify-center space-x-2 w-full"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-red-600">Cüzdanı Çıkart</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

