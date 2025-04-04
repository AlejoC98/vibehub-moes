'use client'

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const body = document.body
    const isLoginPage = pathname === '/auth/login'

    if (isLoginPage) {
      body.classList.add('login-bg')
      body.classList.remove('dashboard-bg')
    } else {
      body.classList.add('dashboard-bg')
      body.classList.remove('login-bg')
    }

    return () => {
      body.classList.remove('login-bg')
      body.classList.remove('dashboard-bg')
    }
  }, [pathname])

  return <>{children}</>
}
