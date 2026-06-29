import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Zap, Heart, ChevronLeft, Star, Package } from 'lucide-react'
import { productService } from '../services/api'
import { useCartStore, useWishlistStore } from '../store'
import ProductCard from '../components/ui/ProductCard'
import toast from 'react-hot-toast'
import type { Product } from '../types'

const MOCK: Product = {
  id: 1, name: 'Strawberry Mochi Squishy', price: 189, stock: 24,
  description: 'Super slow-rising strawberry mochi squishy! Made from premium memory foam, this adorable squishy is scented with a sweet strawberry fragrance. Perfect for stress relief and collection!',
  imageUrls: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=600',
    'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600',
  ],
  variants: ['Pink', 'Yellow', 'Mint'],
  categoryId: 1, categoryName: 'Squishy', active: true,
  newArrival: true, featured: true, soldCount: 128, createdAt: '',
}
const RELATED: Product[] = [
  { id: 3, name: 'Rainbow Cat Figurine Set', price: 420, stock: 8, imageUrls: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400'], variants: [], categoryId: 1, categoryName: 'Squishy', active: true, newArrival: true, featured: true, soldCount: 47, description: '', createdAt: '' },
  { id: 6, name: 'Cloud Pillow Squishy', price: 199, stock: 5, imageUrls: ['https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400'], variants: ['White','Pink'], categoryId: 1, categoryName: 'Squishy', active: true, newArrival: false, featured: false, soldCount: 60, description: '', createdAt: '' },
  { id: 2, name: 'Bunny Plushie Pillow', price: 349, stock: 12, imageUrls: ['https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400'], variants: [], categoryId: 2, categoryName: 'Plushie', active: true, newArrival: false, featured: true, soldCount: 94, description: '', createdAt: '' },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [variant, setVariant] = useState<string | undefined>()
  const [qty, setQty] = useState(1)
  const addItem = useCartStore(s => s.addItem)
  const { toggle, has } = useWishlistStore()
  const navigate = useNavigate()

  useEffect(() => {
    setActiveImg(0); setQty(1); setVariant(undefined)
    productService.getById(Number(id))
      .then(r => setProduct(r.data.data))
      .catch(() => setProduct(MOCK))
  }, [id])

  if (!product) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin" />
    </div>
  )

  const outOfStock = product.stock === 0
  const wishlisted = has(product.id)

  const handleAddCart = () => {
    if (product.variants.length && !variant) { toast.error('Please select a variant first!'); return }
    addItem(product, variant, qty)
    toast.success(`${qty}x ${product.name} added to cart! 🛒`)
  }

  const handleBuyNow = () => {
    if (product.variants.length && !variant) { toast.error('Please select a variant first!'); return }
    // Thêm vào cart nhưng không toast, redirect thẳng sang cart/checkout
    addItem(product, variant, qty)
    navigate('/cart')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <Link to="/shop" className="inline-flex items-center gap-1 text-pink-500 text-sm font-bold mb-6 hover:gap-2 transition-all">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-pink-50 rounded-3xl overflow-hidden mb-3">
            <img src={product.imageUrls[activeImg]} alt={product.name}
              className="w-full h-full object-cover" />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="flex gap-2">
              {product.imageUrls.map((url, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                    ${activeImg === i ? 'border-pink-500 scale-105' : 'border-transparent'}`}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-pink-500 text-xs font-bold uppercase tracking-wide mb-2">{product.categoryName}</p>
          <h1 className="text-2xl font-black text-gray-800 mb-2">{product.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}</div>
            <span className="text-sm text-gray-500">4.9 (128 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-black text-pink-500">{product.price.toLocaleString()} VND</span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            <Package size={14} className="text-green-500" />
            <span className={`text-sm font-semibold ${outOfStock ? 'text-red-400' : 'text-green-600'}`}>
              {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-bold text-gray-700 mb-2">
                Variant: {variant && <span className="text-pink-500">{variant}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button key={v} onClick={() => setVariant(v)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all
                      ${variant === v ? 'border-pink-500 bg-pink-500 text-white' : 'border-pink-200 text-gray-700 hover:border-pink-400'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full border-2 border-pink-200 flex items-center justify-center
                           text-pink-500 font-bold hover:bg-pink-50 transition-colors">−</button>
              <span className="w-8 text-center font-bold text-lg">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="w-9 h-9 rounded-full border-2 border-pink-200 flex items-center justify-center
                           text-pink-500 font-bold hover:bg-pink-50 transition-colors">+</button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleAddCart} disabled={outOfStock}
              className="flex-1 flex items-center justify-center gap-2 btn-outline disabled:opacity-40">
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={outOfStock}
              className="flex-1 flex items-center justify-center gap-2 btn-primary disabled:opacity-40">
              <Zap size={16} /> Buy Now
            </button>
            <button onClick={() => toggle(product.id)}
              className="w-12 h-12 rounded-full border-2 border-pink-200 flex items-center justify-center hover:bg-pink-50 transition-colors">
              <Heart size={18} className={wishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'} />
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      <div>
        <h2 className="text-xl font-black text-gray-800 mb-5">You might also like 💕</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {RELATED.filter(p => p.id !== product.id).slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}