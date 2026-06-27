import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Heart, Flower2, User } from 'lucide-react'
import { useCartStore, useWishlistStore, useAuthStore } from '../../store'

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount())
  const wishlistCount = useWishlistStore((s) => s.ids.length)
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-pink-500 text-lg">
          <Flower2 size={22} className="fill-pink-400 text-pink-500" />
          Squishy Heaven PH
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {[['/', 'Home'], ['/shop', 'Shop'], ['/taobao', 'Taobao Order']].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive ? 'text-pink-500' : 'text-gray-600 hover:text-pink-400 transition-colors'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <Link to="/cart" className="relative p-2 hover:bg-pink-50 rounded-full transition-colors">
            <ShoppingCart size={20} className="text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold
                               w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
          <Link to="/wishlist" className="relative p-2 hover:bg-pink-50 rounded-full transition-colors">
            <Heart size={20} className="text-gray-700" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold
                               w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <Link to={user.role === 'ADMIN' ? '/admin' : '/account'}
              className="flex items-center gap-1.5 ml-1 pl-2 border-l border-pink-100">
              <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center
                              font-bold text-pink-600 text-xs">
                {user.fullName.charAt(0)}
              </div>
              <span className="hidden md:block text-sm font-bold text-gray-700 max-w-[80px] truncate">
                {user.role === 'ADMIN' ? '⚙️ Admin' : user.fullName.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link to="/login"
              className="ml-1 flex items-center gap-1.5 bg-pink-500 text-white text-sm font-bold
                         px-4 py-1.5 rounded-full hover:bg-pink-600 transition-colors">
              <User size={14} /> Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}