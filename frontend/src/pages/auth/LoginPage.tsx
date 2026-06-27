import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Flower2 } from 'lucide-react'
import { authService } from '../../services/api'
import { useAuthStore } from '../../store'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/'

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Vui lòng điền đầy đủ thông tin'); return }
    setLoading(true)
    try {
      const res = await authService.login(email, password)
      const { accessToken, user } = res.data.data
      setAuth(user, accessToken)
      toast.success(`Chào mừng trở lại, ${user.fullName}! 🌸`)
      navigate(from, { replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center">
              <Flower2 size={28} className="text-pink-500 fill-pink-300" />
            </div>
            <span className="font-extrabold text-pink-500 text-lg">Squishy Heaven PH</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Đăng nhập vào tài khoản của bạn</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Email</label>
            <input type="email" className="input-field" placeholder="maria@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-500">Mật khẩu</label>
            </div>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} className="input-field pr-10"
                placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              <button onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button onClick={handleLogin} disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading
              ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : 'Đăng nhập 🌸'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-pink-500 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}