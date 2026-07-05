import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Instagram, Facebook } from 'lucide-react'
import Navbar from './components/layout/Navbar'
import AdminLayout from './components/admin/AdminLayout'

import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import TaobaoPage from './pages/TaobaoPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AccountPage from './pages/auth/AccountPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminTaobaoOrders from './pages/admin/AdminTaobaoOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminLogin from './pages/admin/AdminLogin'
import Wishlist from './pages/WishlistPage'
import NotificationsPage from './pages/NotificationPage'
import QRDepositPage from './pages/QrdepositPage'

function CustomerLayout({ children }: { children: React.ReactNode }) {
  const TiktokIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.03 1.6 4.25.91.83 2.1 1.4 3.32 1.63v3.85c-1.46-.07-2.88-.63-4.04-1.57v7.28c0 3.65-2.58 6.95-6.2 7.42-3.76.62-7.34-1.63-8.15-5.32-.88-3.5 1.13-7.18 4.62-8.16.89-.27 1.83-.31 2.76-.14v3.91c-.88-.23-1.84-.07-2.59.45-.96.61-1.44 1.76-1.25 2.87.24 1.57 1.68 2.69 3.27 2.5 1.53-.11 2.72-1.39 2.72-2.92V0h.02z" />
    </svg>
  );

  return (
    <>
      <Navbar />
      {children}
      <footer className="bg-white border-t border-pink-100 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 font-extrabold text-pink-500 text-lg mb-3">
                🌸 Peatea Squishy
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Your kawaii toy paradise & trusted Taobao order service in the Viet Nam! 🎀
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://www.instagram.com/tiemnhatea10/', color: 'hover:text-pink-600' },
                  { icon: <Facebook size={18} />, label: 'Facebook', href: 'https://facebook.com', color: 'hover:text-blue-600' },
                  { icon: <TiktokIcon size={16} />, label: 'TikTok', href: 'https://www.tiktok.com/@tiemteasquishy._.t', color: 'hover:text-black' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    title={s.label}
                    className={`w-9 h-9 bg-pink-50 text-pink-400 rounded-full flex items-center justify-center
                               hover:bg-pink-100 ${s.color} transition-all duration-200 transform hover:-translate-y-0.5`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-gray-700 mb-4">Quick Links</p>
              <ul className="space-y-2.5">
                {[
                  ['/', 'Home'], ['/shop', 'Shop'],
                  ['/taobao', 'Taobao Order'], ['/cart', 'Cart'],
                  ['/account', 'My Account'],
                ].map(([to, label]) => (
                  <li key={to}>
                    <a href={to} className="text-sm text-gray-500 hover:text-pink-500 transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold text-gray-700 mb-4">Contact Us</p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span>📱</span> 0989-095-946
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️</span> hello@squishyheaven.ph
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span> Hanoi, Viet Nam
                </li>
                <li className="flex items-center gap-2">
                  <span>🕐</span> Mon–Sat, 9AM–6PM
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-pink-100 mt-10 pt-5 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Peatea Squishy. All rights reserved. Made with 💕
          </div>
        </div>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/shop" element={<CustomerLayout><ShopPage /></CustomerLayout>} />
        <Route path="/product/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<CustomerLayout><AccountPage /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
        <Route path="/wishlist" element={<CustomerLayout><Wishlist /></CustomerLayout>} />
        <Route path="/taobao" element={<CustomerLayout><TaobaoPage /></CustomerLayout>} />
        <Route path="/notifications" element={<CustomerLayout><NotificationsPage /></CustomerLayout>} />
        <Route path="/checkout/deposit" element={<CustomerLayout><QRDepositPage /></CustomerLayout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="taobao" element={<AdminTaobaoOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<AdminCustomers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}