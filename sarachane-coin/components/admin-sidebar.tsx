"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard,
  ListChecks,
  FileText,
  Users,
  Clock,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logoutAdmin } from '@/lib/auth'

interface AdminSidebarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function AdminSidebar({ isOpen, toggleMenu }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Dark mode logic would go here
  }
  
  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }
  
  // Navigation links
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard
    },
    {
      name: "Boykotlar",
      path: "/admin/boycotts",
      icon: ListChecks
    },
    {
      name: "Protestolar",
      path: "/admin/protests",
      icon: FileText
    },
    {
      name: "Kullanıcılar",
      path: "/admin/users",
      icon: Users
    },
    {
      name: "Onay Bekleyenler",
      path: "/admin/approvals",
      icon: Clock
    },
    {
      name: "Ayarlar",
      path: "/admin/settings",
      icon: Settings
    }
  ]
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed md:sticky top-0 left-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="font-bold text-xl text-gray-800">Admin Panel</h2>
          <button 
            className="md:hidden p-1 rounded-full hover:bg-gray-100"
            onClick={toggleMenu}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    pathname === item.path
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {pathname === item.path && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-gray-200">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-5 w-5" />
                <span>Açık Mod</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span>Koyu Mod</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 mt-2 text-sm text-red-600 rounded-md hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  )
} 