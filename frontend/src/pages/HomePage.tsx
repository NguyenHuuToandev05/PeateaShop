import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { productService } from '../services/api'
import type { Product } from '../types'

const REVIEWS = [
  { initials: 'MS', name: 'Maria Santos', product: 'Bunny Plushie Pillow', text: 'Super cute and arrived so fast! The quality is amazing, my daughter loves it 💕', rating: 5 },
  { initials: 'JL', name: 'Jasmine Lim', product: 'Strawberry Mochi Squishy', text: 'Ordered 3 times already! Packaging is always so pretty and the squishies are sooo satisfying 🌸', rating: 5 },
  { initials: 'BD', name: 'Bea Dela Cruz', product: 'Taobao Service', text: 'Hassle-free! They handled everything from ordering to delivery. Will definitely use again ✨', rating: 5 },
]

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getFeatured()
      .then(r => setFeatured(r.data.data ?? MOCK_FEATURED))
      .catch(() => setFeatured(MOCK_FEATURED))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-hero-gradient px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur text-pink-500
                             text-xs font-bold px-3 py-1.5 rounded-full mb-5 border border-pink-200">
              🌟 New arrivals just dropped ✦
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight mb-3">
              Squishy Heaven PH
            </h1>
            <p className="text-2xl mb-2">🌸</p>
            <p className="text-gray-600 font-medium mb-8 max-w-md">
              Your one-stop shop for adorable squishies, plushies &amp; stationery — plus hassle-free Taobao ordering service!
              <span className="ml-1">🎀</span>
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/shop" className="btn-primary px-8">Shop Now 🛍️</Link>
              <Link to="/taobao" className="btn-outline px-8">Taobao Service</Link>
            </div>
          </div>
          {/* Mascot */}
          <div className="flex-shrink-0">
            <div className="w-52 h-52 md:w-64 md:h-64 bg-pink-200/60 rounded-full flex items-center
                            justify-center relative">
              <div className="w-40 h-40 md:w-52 md:h-52 bg-pink-300/70 rounded-full flex items-center
                              justify-center text-7xl select-none">
                🐷
              </div>
              {/* floating deco */}
              {['♡','✦','⭐','♡'].map((d, i) => (
                <span key={i} className="absolute text-pink-400 font-bold animate-pulse"
                  style={{ top: `${[10,5,75,80][i]}%`, left: `${[10,80,5,85][i]}%`, fontSize: '14px' }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-pink-500 text-sm font-bold mb-1">✦ Hand-picked for you</p>
            <h2 className="text-2xl font-black text-gray-800">Featured Products</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-1 text-pink-500 text-sm font-bold hover:gap-2 transition-all">
            See all <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-pink-100 rounded-t-2xl" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-pink-100 rounded w-1/2" />
                  <div className="h-4 bg-pink-100 rounded w-3/4" />
                  <div className="h-3 bg-pink-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Taobao CTA ── */}
      <section className="bg-taobao-gradient mx-4 md:mx-8 rounded-3xl px-8 py-14 text-center mb-14">
        <div className="text-4xl mb-4">🛒</div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
          Want something from Taobao?
        </h2>
        <p className="text-white/90 font-medium mb-6 max-w-lg mx-auto">
          We'll order it for you! Share the Taobao link and we'll handle everything —
          purchasing, shipping, and delivery straight to your door. No Chinese account needed! 🎉
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm">
          {[
            '1 Find your item on Taobao',
            '2 Submit the link to us',
            '3 We order & ship it for you',
            '4 Receive at your door! 📦',
          ].map(step => (
            <span key={step} className="bg-white/20 text-white font-semibold px-4 py-2 rounded-full backdrop-blur">
              {step}
            </span>
          ))}
        </div>
        <Link to="/taobao" className="inline-block bg-white text-purple-600 font-extrabold
                                       px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg">
          Place a Taobao Order 📦
        </Link>
      </section>

      {/* ── Reviews ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <p className="text-pink-500 text-sm font-bold mb-1">✦ Happy customers</p>
          <h2 className="text-2xl font-black text-gray-800">What they're saying 💕</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center
                                font-extrabold text-pink-600 text-sm flex-shrink-0">
                  {r.initials}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.product}</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Mock data fallback ─────────────────────────────────────────────────────────
const MOCK_FEATURED: Product[] = [
  { id: 1, name: 'Strawberry Mochi Squishy', description: '', price: 189, stock: 24, imageUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'], variants: ['Pink','Yellow','Mint'], categoryId: 1, categoryName: 'Squishy', active: true, newArrival: true, featured: true, soldCount: 128, createdAt: '' },
  { id: 2, name: 'Bunny Plushie Pillow', description: '', price: 349, stock: 12, imageUrls: ['https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400'], variants: [], categoryId: 2, categoryName: 'Plushie', active: true, newArrival: false, featured: true, soldCount: 94, createdAt: '' },
  { id: 3, name: 'Rainbow Cat Figurine Set', description: '', price: 420, stock: 8, imageUrls: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400'], variants: [], categoryId: 1, categoryName: 'Squishy', active: true, newArrival: true, featured: true, soldCount: 47, createdAt: '' },
  { id: 4, name: 'Teddy Bear Plush Buddy', description: '', price: 280, stock: 0, imageUrls: ['https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400'], variants: [], categoryId: 2, categoryName: 'Plushie', active: true, newArrival: false, featured: true, soldCount: 203, createdAt: '' },
]
