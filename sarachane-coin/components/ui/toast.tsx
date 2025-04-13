"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  type: ToastType
  message: string
  duration?: number
}

type ToastContextType = {
  toast: {
    success: (message: string, duration?: number) => void
    error: (message: string, duration?: number) => void
    info: (message: string, duration?: number) => void
    warning: (message: string, duration?: number) => void
  }
}

const ToastContext = React.createContext<ToastContextType>({
  toast: {
    success: () => {},
    error: () => {},
    info: () => {},
    warning: () => {},
  },
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([])

  // Toast creation functions
  const addToast = React.useCallback(
    ({ type, message, duration = 3000 }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9)
      
      setToasts((prev) => [...prev, { type, message, duration, id }])
      
      // Auto remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, duration)
    },
    []
  )

  const toast = React.useMemo(
    () => ({
      success: (message: string, duration?: number) => 
        addToast({ type: "success", message, duration }),
      error: (message: string, duration?: number) => 
        addToast({ type: "error", message, duration }),
      info: (message: string, duration?: number) => 
        addToast({ type: "info", message, duration }),
      warning: (message: string, duration?: number) => 
        addToast({ type: "warning", message, duration }),
    }),
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={cn(
              "rounded-md p-4 text-white shadow-md transition-all",
              {
                "bg-green-600": toast.type === "success",
                "bg-red-600": toast.type === "error",
                "bg-blue-600": toast.type === "info",
                "bg-yellow-600": toast.type === "warning",
              }
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}

// Simple toast functions for direct usage
export const toast = {
  success: (message: string) => {
    // Create a temporary element to show the toast
    const toastEl = document.createElement("div")
    toastEl.className = "fixed top-4 right-4 z-50 bg-green-600 text-white p-4 rounded-md shadow-md"
    toastEl.textContent = message
    document.body.appendChild(toastEl)
    
    // Remove after 3 seconds
    setTimeout(() => {
      toastEl.style.opacity = "0"
      toastEl.style.transition = "opacity 0.5s ease"
      setTimeout(() => document.body.removeChild(toastEl), 500)
    }, 3000)
  },
  
  error: (message: string) => {
    const toastEl = document.createElement("div")
    toastEl.className = "fixed top-4 right-4 z-50 bg-red-600 text-white p-4 rounded-md shadow-md"
    toastEl.textContent = message
    document.body.appendChild(toastEl)
    
    setTimeout(() => {
      toastEl.style.opacity = "0"
      toastEl.style.transition = "opacity 0.5s ease"
      setTimeout(() => document.body.removeChild(toastEl), 500)
    }, 3000)
  },
  
  info: (message: string) => {
    const toastEl = document.createElement("div")
    toastEl.className = "fixed top-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-md shadow-md"
    toastEl.textContent = message
    document.body.appendChild(toastEl)
    
    setTimeout(() => {
      toastEl.style.opacity = "0"
      toastEl.style.transition = "opacity 0.5s ease"
      setTimeout(() => document.body.removeChild(toastEl), 500)
    }, 3000)
  },
  
  warning: (message: string) => {
    const toastEl = document.createElement("div")
    toastEl.className = "fixed top-4 right-4 z-50 bg-yellow-600 text-white p-4 rounded-md shadow-md"
    toastEl.textContent = message
    document.body.appendChild(toastEl)
    
    setTimeout(() => {
      toastEl.style.opacity = "0"
      toastEl.style.transition = "opacity 0.5s ease"
      setTimeout(() => document.body.removeChild(toastEl), 500)
    }, 3000)
  }
} 