import { Link } from 'react-router-dom'
import { ArrowUpRight, Instagram, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-about"><Link to="/" className="brand">peatea<span className="brand-dot">.</span></Link><p>Một góc nhỏ cho những điều dễ thương.<br />Và những niềm vui thật giản đơn.</p><a className="social-link" href="https://www.instagram.com/tiemnhatea10/" target="_blank" rel="noreferrer"><Instagram size={16} /> Theo dõi câu chuyện của Peatea <ArrowUpRight size={14} /></a></div>
        <div><h3>Khám phá</h3><Link to="/shop">Tất cả sản phẩm</Link><Link to="/shop?new=1">Sản phẩm mới</Link><Link to="/taobao">Dịch vụ đặt hộ Taobao</Link><Link to="/wishlist">Danh sách yêu thích</Link></div>
        <div><h3>Góc của bạn</h3><Link to="/account">Tài khoản của tôi</Link><Link to="/cart">Giỏ hàng</Link><Link to="/account">Theo dõi đơn hàng</Link><Link to="/notifications">Thông báo</Link></div>
        <div><h3>Kết nối với Peatea</h3><a href="tel:0989095946"><Phone size={14} /> 0989 095 946</a><p className="footer-location"><MapPin size={14} /> Hà Nội, Việt Nam</p><p>Thứ Hai – Thứ Bảy<br />09:00 – 18:00</p><a href="https://www.tiktok.com/@tiemteasquishy._.t" target="_blank" rel="noreferrer">Ghé Peatea trên TikTok <ArrowUpRight size={13} /></a></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} Peatea. All rights reserved.</span><span>Chọn ít hơn. Yêu nhiều hơn.</span><span>Made with care, in Vietnam.</span></div>
    </footer>
  )
}
