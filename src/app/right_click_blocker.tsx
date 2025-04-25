'use client'
import React, { useEffect } from 'react'

function RightClickBlocker({ children }: { children: React.ReactNode }) {
    useEffect(() => {
      const disableRightClick = (e: MouseEvent) => e.preventDefault()
      document.addEventListener('contextmenu', disableRightClick)
      
      return () => {
        document.removeEventListener('contextmenu', disableRightClick)
      }
    }, [])
  
    return <>{children}</>
  }

export default RightClickBlocker
