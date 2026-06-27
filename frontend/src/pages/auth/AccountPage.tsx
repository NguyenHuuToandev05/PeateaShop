import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, LogOut, User, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store'
import { orderService, taobaoService } from '../../services/api'
import type { Order, TaobaoOrder } from '../../types'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ xác nhận', PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao', COMPLETED: 'Đã giao', CANCELLED: 'Đã huỷ',
  NEW: 'Mới', CONFIRMED: 'Đã xác nhận',
  ORDERED_ON_TAOBAO: 'Đã đặt TB', SHIPPED_FROM_CHINA: 'Đang ship', DELIVERED: 'Đã nhận',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700', COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700', NEW: 'bg-pink-100 text-pink-700',
  CONFIRMED: 'bg-blue-100 text-blue-700', ORDERED_ON_TAOBAO: 'bg-indigo-100 text-indigo-700',
  SHIPPED_FROM_CHINA: 'bg-purple-100 text-purple-700', DELIVERED: 'bg-green-100 text-green-700',
}

export default function AccountPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [taobao, setTaobao] = useState<TaobaoOrder[]>([])
  const [tab, setTab] = useState<'orders' | 'taobao'>('orders')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'ADMIN') { navigate('/admin'); return }
    orderService.getMyOrders().then(r => setOrders(r.data.data ?? [])).catch(() => {})
    taobaoService.getMy().then(r => setTaobao(r.data.data ?? [])).catch(() => {})
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile card */}
      <div className="card p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-pink-200 rounded-full flex items-center justify-center
                        font-extrabold text-pink-600 text-xl flex-shrink-0">
          {user.fullName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-gray-800">{user.fullName}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
          <p className="text-sm text-gray-400">{user.phone}</p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors">
          <LogOut size={15} /> Đăng xuất
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['orders', 'taobao'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors
              ${tab === t ? 'bg-pink-500 text-white' : 'bg-white text-gray-500 border border-pink-200 hover:border-pink-400'}`}>
            {t === 'orders' ? '🛍️ Đơn hàng' : '📦 Order Taobao'}
          </button>
        ))}
      </div>

      {/* Orders */}
      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16 card">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-bold text-gray-500">Chưa có đơn hàng nào</p>
              <Link to="/shop" className="btn-primary inline-block mt-4 px-6 text-sm py-2">
                Mua sắm ngay
              </Link>
            </div>
          ) : orders.map(o => (
            <div key={o.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-pink-500 text-sm">{o.orderCode}</p>
                  <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[o.status]}`}>
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
              <div className="border-t border-pink-50 pt-2 mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {o.paymentMethod === 'COD' ? 'Thanh toán khi nhận' : 'Chuyển khoản'}
                </p>
                <p className="font-extrabold text-pink-500">₱{o.total?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Taobao orders */}
      {tab === 'taobao' && (
        <div className="space-y-3">
          {taobao.length === 0 ? (
            <div className="text-center py-16 card">
              <div className="text-4xl mb-3">📦</div>
              <p className="font-bold text-gray-500">Chưa có order Taobao nào</p>
              <Link to="/taobao" className="btn-primary inline-block mt-4 px-6 text-sm py-2">
                Đặt hàng Taobao
              </Link>
            </div>
          ) : taobao.map(o => (
            <div key={o.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-pink-500 text-sm">{o.orderCode}</p>
                  <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[o.status]}`}>
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">{o.productDescription}</p>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-pink-50">
                <p className="text-xs text-gray-400">SL: {o.quantity}{o.colorSize ? ` · ${o.colorSize}` : ''}</p>
                {o.trackingNumber && (
                  <p className="text-xs font-semibold text-purple-600">Tracking: {o.trackingNumber}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}