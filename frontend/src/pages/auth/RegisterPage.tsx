import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Flower2 } from 'lucide-react'
import { authService } from '../../services/api'
import { useAuthStore } from '../../store'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleRegister = async () => {
    const { fullName, email, phone, password, confirm } = form
    if (!fullName || !email || !phone || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin'); return
    }
    if (password.length < 6) {
      toast.error('Mật khẩu tối thiểu 6 ký tự'); return
    }
    if (password !== confirm) {
      toast.error('Mật khẩu xác nhận không khớp'); return
    }
    setLoading(true)
    try {
      const res = await authService.register({ fullName, email, phone, password })
      const { accessToken, user } = res.data.data
      setAuth(user, accessToken)
      toast.success(`Chào mừng ${user.fullName}! 🎀`)
      navigate('/')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Đăng ký thất bại, thử lại nhé!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center">
              <Flower2 size={28} className="text-pink-500 fill-pink-300" />
            </div>
            <span className="font-extrabold text-pink-500 text-lg">Squishy Heaven PH</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Tạo tài khoản mới</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Họ tên *</label>
            <input className="input-field" placeholder="Maria Santos"
              value={form.fullName} onChange={set('fullName')} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Email *</label>
            <input type="email" className="input-field" placeholder="maria@email.com"
              value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Số điện thoại *</label>
            <input type="tel" className="input-field" placeholder="09171234567"
              value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Mật khẩu *</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} className="input-field pr-10"
                placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={set('password')} />
              <button onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Xác nhận mật khẩu *</label>
            <input type="password" className="input-field" placeholder="Nhập lại mật khẩu"
              value={form.confirm} onChange={set('confirm')}
              onKeyDown={e => e.key === 'Enter' && handleRegister()} />
          </div>

          <button onClick={handleRegister} disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 !mt-5">
            {loading
              ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : 'Đăng ký 🎀'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-pink-500 font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}