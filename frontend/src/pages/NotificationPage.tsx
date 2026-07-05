import { useState } from 'react'
import { Bell, Package, ShoppingBag, Tag, X, CheckCheck } from 'lucide-react'

interface Notification {
  id: number
  type: 'order' | 'taobao' | 'promo'
  title: string
  message: string
  time: string
  read: boolean
}

const MOCK_NOTIFS: Notification[] = [
  { id: 1, type: 'order', title: 'Đơn hàng đã được xác nhận', message: 'Đơn SH-1001 của bạn đã được xác nhận và đang được chuẩn bị.', time: '5 phút trước', read: false },
  { id: 2, type: 'taobao', title: 'Order Taobao đang vận chuyển', message: 'TB-2001 đã được ship từ Trung Quốc. Mã vận đơn: YT2024123456.', time: '2 giờ trước', read: false },
  { id: 3, type: 'promo', title: 'Sale 20% toàn bộ Squishy! 🎉', message: 'Chỉ hôm nay! Giảm 20% toàn bộ sản phẩm squishy. Đừng bỏ lỡ nhé!', time: '1 ngày trước', read: true },
  { id: 4, type: 'order', title: 'Đơn hàng đã giao thành công', message: 'Đơn SH-0998 đã được giao. Cảm ơn bạn đã mua sắm tại Peatea Squishy! 💕', time: '2 ngày trước', read: true },
  { id: 5, type: 'taobao', title: 'Taobao order đã xác nhận', message: 'TB-1998 đã được xác nhận. Chúng mình sẽ liên hệ để chốt giá sớm nhé.', time: '3 ngày trước', read: true },
]

const TYPE_ICON = {
  order:  { icon: ShoppingBag, bg: 'bg-blue-50',   color: 'text-blue-500' },
  taobao: { icon: Package,     bg: 'bg-purple-50', color: 'text-purple-500' },
  promo:  { icon: Tag,         bg: 'bg-pink-50',   color: 'text-pink-500' },
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifs.filter(n => !n.read).length
  const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs

  const markRead = (id: number) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))

  const markAllRead = () =>
    setNotifs(ns => ns.map(n => ({ ...n, read: true })))

  const deleteNotif = (id: number) =>
    setNotifs(ns => ns.filter(n => n.id !== id))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={18} className="text-pink-500" />
            <h1 className="text-xl font-black text-gray-800">Thông báo</h1>
            {unreadCount > 0 && (
              <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{unreadCount} chưa đọc</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-pink-500 font-bold hover:text-pink-600">
            <CheckCheck size={14} /> Đọc tất cả
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {([['all', 'Tất cả'], ['unread', 'Chưa đọc']] as const).map(([v, label]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors
              ${filter === v ? 'bg-pink-500 text-white' : 'bg-white text-gray-500 border border-pink-200 hover:border-pink-400'}`}>
            {label} {v === 'unread' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-4xl mb-3">🔔</div>
          <p className="font-bold text-gray-500">Không có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(n => {
            const { icon: Icon, bg, color } = TYPE_ICON[n.type]
            return (
              <div key={n.id}
                className={`card p-4 flex gap-3 transition-all cursor-pointer
                  ${!n.read ? 'border-pink-200 bg-pink-50/50' : 'bg-white'}`}
                onClick={() => markRead(n.id)}>
                {/* Icon */}
                <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold ${!n.read ? 'text-gray-800' : 'text-gray-600'}`}>
                      {n.title}
                      {!n.read && <span className="inline-block w-2 h-2 bg-pink-500 rounded-full ml-2 mb-0.5" />}
                    </p>
                    <button onClick={e => { e.stopPropagation(); deleteNotif(n.id) }}
                      className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5">
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{n.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}