'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GatePage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  function submit() {
    if (user === 'admin' && pass === 'admin') {
      sessionStorage.setItem('yg_gate', '1')
      router.replace('/login')
    } else {
      setError(true)
      setPass('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs">
        <div className="text-center mb-6">
          <img src="/logo.svg" alt="Yigo" className="h-10 w-auto mx-auto mb-3" />
          <div className="text-xs text-gray-400">内部测试入口</div>
        </div>
        {error && <div className="mb-4 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 text-center">用户名或密码错误</div>}
        <div className="space-y-3">
          <input value={user} onChange={e => { setUser(e.target.value); setError(false) }}
            placeholder="用户名" autoComplete="off"
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
          <input value={pass} onChange={e => { setPass(e.target.value); setError(false) }}
            placeholder="密码" type="password"
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
        </div>
        <button onClick={submit}
          className="w-full mt-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 text-sm">
          进入
        </button>
      </div>
    </div>
  )
}
