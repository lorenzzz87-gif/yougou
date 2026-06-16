'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { store } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const user = store.getCurrentUser()
    if (user) {
      router.replace(`/${user.role}`)
    } else {
      router.replace('/login')
    }
  }, [router])
  return null
}
