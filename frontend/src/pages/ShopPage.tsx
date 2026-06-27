import { useEffect, useState, useCallback } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { productService, categoryService } from '../services/api'
import type { Product, Category } from '../types'

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Strawberry Mochi Squishy', description: '', price: 189, stock: 24, imageUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'], variants: ['Pink','Yellow','Mint'], categoryId: 1, categoryName: 'Squishy', active: true, newArrival: true, featured: true, soldCount: 128, createdAt: '' },
  { id: 2, name: 'Bunny Plushie Pillow', description: '', price: 349, stock: 12, imageUrls: ['https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400'], variants: [], categoryId: 2, categoryName: 'Plushie', active: true, newArrival: false, featured: true, soldCount: 94, createdAt: '' },
  { id: 3, name: 'Rainbow Cat Figurine Set', description: '', price: 420, stock: 8, imageUrls: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400'], variants: [], categoryId: 1, categoryName: 'Squishy', active: true, newArrival: true, featured: true, soldCount: 47, createdAt: '' },
  { id: 4, name: 'Teddy Bear Plush Buddy', description: '', price: 280, stock: 0, imageUrls: ['https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400'], variants: [], categoryId: 2, categoryName: 'Plushie', active: true, newArrival: false, featured: true, soldCount: 203, createdAt: '' },
  { id: 5, name: 'Fox Kitsune Mask Set', description: '', price: 350, stock: 15, imageUrls: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400'], variants: [], categoryId: 3, categoryName: 'Stationery', active: true, newArrival: true, featured: false, soldCount: 30, createdAt: '' },
  { id: 6, name: 'Cloud Pillow Squishy', description: '', price: 199, stock: 5, imageUrls: ['https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400'], variants: ['White','Pink'], categoryId: 1, categoryName: 'Squishy', active: true, newArrival: false, featured: false, soldCount: 60, createdAt: '' },
]
const MOCK_CATS: Category[] = [
  { id: 1, name: 'Squishy', description: '', imageUrl: '', active: true, productCount: 4 },
  { id: 2, name: 'Plushie', description: '', imageUrl: '', active: true, productCount: 3 },
  { id: 3, name: 'Stationery', description: '', imageUrl: '', active: true, productCount: 2 },
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  // Filters
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [newOnly, setNewOnly] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, cRes] = await Promise.all([
        productService.search({ categoryId: selectedCat, maxPrice, newArrival: newOnly || undefined }),
        categoryService.getAll(),
      ])
      setProducts(pRes.data.data?.content ?? MOCK_PRODUCTS)
      setCategories(cRes.data.data ?? MOCK_CATS)
    } catch {
      setProducts(MOCK_PRODUCTS)
      setCategories(MOCK_CATS)
    } finally {
      setLoading(false)
    }
  }, [selectedCat, maxPrice, newOnly])

  useEffect(() => { loadData() }, [loadData])

  const filtered = products.filter(p =>
    (selectedCat == null || p.categoryId === selectedCat) &&
    p.price <= maxPrice &&
    (!newOnly || p.newArrival)
  )

  const clearFilters = () => { setSelectedCat(null); setMaxPrice(1000); setNewOnly(false) }

  const FilterPanel = () => (
    <div className="card p-5 space-y-5">
      <div className="flex items-center gap-2 font-bold text-gray-700">
        <SlidersHorizontal size={16} className="text-pink-500" />
        Filters
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Category</p>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCat(null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors
              ${selectedCat == null ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-pink-50'}`}
          >
            ● All Products
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors
                ${selectedCat === c.id ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-pink-50'}`}
            >
              ● {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Price Range <span className="text-pink-500 normal-case font-bold">₱0 – ₱{maxPrice}</span>
        </p>
        <input
          type="range" min={50} max={1000} step={50} value={maxPrice}
          onChange={e => setMaxPrice(+e.target.value)}
          className="w-full accent-pink-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>₱50</span><span>₱1000</span>
        </div>
      </div>

      {/* New arrivals toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">New Arrivals Only</span>
        <button
          onClick={() => setNewOnly(v => !v)}
          className={`w-11 h-6 rounded-full transition-colors relative ${newOnly ? 'bg-pink-500' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${newOnly ? 'left-6' : 'left-1'}`} />
        </button>
      </div>

      <button onClick={clearFilters} className="text-pink-500 text-sm font-semibold hover:underline">
        Clear filters
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-pink-500 text-sm font-bold mb-1">✦ Browse our collection</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-800">Shop All Products</h1>
            <p className="text-gray-400 text-sm mt-1">{filtered.length} items found</p>
          </div>
          <button
            onClick={() => setShowFilter(v => !v)}
            className="md:hidden flex items-center gap-2 btn-outline py-2 px-4 text-sm"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar – desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <FilterPanel />
        </aside>

        {/* Mobile filter drawer */}
        {showFilter && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilter(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setShowFilter(false)}><X size={20} /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-pink-100 rounded-t-2xl" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-pink-100 rounded w-1/2" />
                    <div className="h-4 bg-pink-100 rounded" />
                    <div className="h-3 bg-pink-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-bold text-gray-600 mb-2">No products found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-primary mt-4 px-6 py-2 text-sm">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
