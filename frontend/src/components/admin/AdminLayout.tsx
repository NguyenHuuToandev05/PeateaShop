import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, Box, Users, Settings, LogOut, Flower2, Bell } from 'lucide-react'
import { useAuthStore } from '../../store'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/taobao', label: 'Taobao Orders', icon: Package },
  { to: '/admin/products', label: 'Products', icon: Box },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-pink-500">
            <Flower2 size={20} className="fill-pink-400" />
            <span className="text-sm">Peatea Squishy</span>
          </Link>
          <p className="text-xs text-gray-400 mt-0.5 ml-7">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors
                 ${isActive ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`
              }>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center
                            font-bold text-pink-600 text-xs">
              {user?.fullName?.charAt(0) ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-700 truncate">{user?.fullName ?? 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email ?? 'admin@shop.com'}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 transition-colors w-full">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-56">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="relative">
            <input placeholder="Search orders, products..."
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm w-64
                         focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100" />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-50 rounded-full">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center
                            font-bold text-pink-600 text-xs">
              {user?.fullName?.charAt(0) ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
