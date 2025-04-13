"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

interface DialogContentProps {
  className?: string
  children?: React.ReactNode
  onClose?: () => void
}

const DialogContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  open: false,
  setOpen: () => {},
})

const Dialog: React.FC<DialogProps> = ({
  open = false,
  onOpenChange,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(open)

  // Fix for infinite loop - only update state when prop actually changes
  // and track previous value to avoid unnecessary updates
  const prevOpenRef = React.useRef(open)
  React.useEffect(() => {
    // Only update if prop changed from previous render
    if (prevOpenRef.current !== open) {
      setIsOpen(open)
      prevOpenRef.current = open
    }
  }, [open])

  // Only call onOpenChange when isOpen changes due to internal state changes, not props
  const prevIsOpenRef = React.useRef(isOpen)
  React.useEffect(() => {
    // Only trigger callback if state actually changed and is different from props
    // to avoid feedback loops
    if (prevIsOpenRef.current !== isOpen && open !== isOpen && onOpenChange) {
      onOpenChange(isOpen)
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen, onOpenChange, open])

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ children, className }) => {
  const { setOpen } = React.useContext(DialogContext)

  return (
    <button className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
  onClose,
}) => {
  const { open, setOpen } = React.useContext(DialogContext)
  const prevOpenRef = React.useRef(open)

  // Add event listener to close on escape key
  React.useEffect(() => {
    if (!open) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        if (onClose) onClose()
      }
    }
    
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onClose, setOpen])

  const handleClose = () => {
    setOpen(false)
    if (onClose) onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className={cn(
          "relative max-h-[85vh] w-[90vw] max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg animate-in fade-in zoom-in text-gray-900",
          className
        )}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 text-black"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  )
}

const DialogHeader: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
    >
      {children}
    </div>
  )
}

const DialogFooter: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
    >
      {children}
    </div>
  )
}

const DialogTitle: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ children, className }) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-black",
        className
      )}
    >
      {children}
    </h3>
  )
}

const DialogDescription: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ children, className }) => {
  return (
    <p
      className={cn(
        "text-sm text-gray-700",
        className
      )}
    >
      {children}
    </p>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} 