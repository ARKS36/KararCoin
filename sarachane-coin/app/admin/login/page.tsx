"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { verifyAdminCredentials, loginAdmin, isAdminLoggedIn } from "@/lib/auth"
import { Lock, User } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  // Oturum açık mı kontrol et
  useEffect(() => {
    if (isAdminLoggedIn()) {
      router.push("/admin")
    }
  }, [router])
  
  // Giriş fonksiyonu
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    if (!username || !password) {
      toast.error("Lütfen kullanıcı adı ve şifre girin")
      setIsLoading(false)
      return
    }
    
    // Kimlik doğrulama işlemi
    setTimeout(() => {
      const isValid = verifyAdminCredentials(username, password)
      
      if (isValid) {
        // Başarılı giriş
        loginAdmin()
        toast.success("Giriş başarılı! Yönlendiriliyorsunuz...")
        
        // Admin paneline yönlendir
        setTimeout(() => {
          router.push("/admin")
        }, 1000)
      } else {
        // Hatalı giriş
        toast.error("Hatalı kullanıcı adı veya şifre")
        setIsLoading(false)
      }
    }, 1000) // 1 saniye gecikme ile gerçek giriş hissi ver
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Girişi</CardTitle>
          <CardDescription>Yönetim paneline erişmek için giriş yapın</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="username">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kullanıcı adınızı girin"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Şifrenizi girin"
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 