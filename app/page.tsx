'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { store } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const isB2BHost = window.location.hostname.startsWith('b2b.')
    const user = store.getCurrentUser()
    if (!user) {
      if (isB2BHost) { router.replace('/entry'); return }
      // yigo.eu — require gate pass
      const gated = sessionStorage.getItem('yg_gate')
      router.replace(gated ? '/login' : '/gate')
      return
    }
    if (user.role === 'buyer') {
      router.replace(isB2BHost || window.innerWidth >= 1024 ? '/b2b' : '/buyer')
    } else {
      router.replace(`/${user.role}`)
    }
  }, [router])
  return null
}
