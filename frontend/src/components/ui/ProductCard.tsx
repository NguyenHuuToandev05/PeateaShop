import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useCartStore, useWishlistStore } from '../../store'
import toast from 'react-hot-toast'

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, has } = useWishlistStore()
  const wishlisted = has(product.id)
  const outOfStock = product.stock === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (outOfStock) return
    addItem(product)
    toast.success(`1x ${product.name} added to cart! 🛒`, {
      style: { borderRadius: '12px', fontFamily: 'Nunito' },
    })
  }

  return (
    <Link to={`/product/${product.id}`} className="group card overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-square bg-pink-50 overflow-hidden">
        <img
          src={product.imageUrls[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badges */}
        {product.newArrival && !outOfStock && (
          <span className="absolute top-2 left-2 badge-new">NEW ✦</span>
        )}
        {outOfStock && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 badge-sold-out">Sold Out</span>
        )}
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id) }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center
                     shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={14}
            className={wishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-gray-400 font-semibold mb-0.5">{product.categoryName}</p>
        <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">{product.name}</h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500">4.9 (128)</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-extrabold text-pink-500">₱{product.price.toLocaleString()}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center
                       hover:bg-pink-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                       active:scale-95"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  )
}
