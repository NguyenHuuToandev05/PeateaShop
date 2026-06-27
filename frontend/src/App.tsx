import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import AdminLayout from './components/admin/AdminLayout'

// Pages
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

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <footer className="bg-white border-t border-pink-100 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p className="font-bold text-pink-500 mb-1">🌸 Squishy Heaven PH</p>
          <p>Your one-stop shop for adorable squishies, plushies & stationery</p>
          <p className="mt-2">📱 Instagram: @squishyheavenph · 📧 squishyheaven@email.com</p>
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
        {/* Customer routes */}
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/shop" element={<CustomerLayout><ShopPage /></CustomerLayout>} />
        <Route path="/product/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<CustomerLayout><AccountPage /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
        <Route path="/wishlist" element={<CustomerLayout><ShopPage /></CustomerLayout>} />
        <Route path="/taobao" element={<CustomerLayout><TaobaoPage /></CustomerLayout>} />

        {/* Admin routes */}
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