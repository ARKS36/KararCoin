"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAdminLoggedIn } from "@/lib/auth"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Kimlik doğrulama kontrolü
  useEffect(() => {
    // Login sayfasındaysa kontrole gerek yok
    if (pathname === "/admin/login") return;
    
    // Admin girişi yapılmamışsa login sayfasına yönlendir
    if (!isAdminLoggedIn()) {
      router.push("/admin/login");
    }
  }, [pathname, router]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  // Login sayfasında ise sidebar gösterme
  if (pathname === "/admin/login") {
    return <>{children}</>
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <AdminSidebar isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      <div className="flex-1 w-full">
        <div className="md:hidden p-4 flex items-center border-b border-gray-200">
          <button
            onClick={toggleMenu}
            className="p-2 focus:outline-none text-gray-700 hover:text-gray-900"
            aria-label="Toggle Menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2 className="ml-4 text-lg font-semibold text-gray-800">Admin Panel</h2>
        </div>
        
        <main className="p-4 overflow-auto bg-gray-50 min-h-screen">{children}</main>
      </div>
    </div>
  )
} 