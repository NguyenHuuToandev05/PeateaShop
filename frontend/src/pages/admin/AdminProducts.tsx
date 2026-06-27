import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { productService, categoryService } from '../../services/api'
import type { Product, Category } from '../../types'
import toast from 'react-hot-toast'

const MOCK_P: Product[] = [
  { id:1, name:'Strawberry Mochi Squishy', price:189, stock:24, imageUrls:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100'], variants:['Pink','Yellow','Mint'], categoryId:1, categoryName:'Squishy', active:true, newArrival:true, featured:true, soldCount:128, description:'Slow-rising mochi squishy', createdAt:'' },
  { id:2, name:'Bunny Plushie Pillow', price:349, stock:12, imageUrls:['https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=100'], variants:[], categoryId:2, categoryName:'Plushie', active:true, newArrival:false, featured:true, soldCount:94, description:'Soft bunny pillow', createdAt:'' },
  { id:3, name:'Rainbow Cat Figurine Set', price:420, stock:8, imageUrls:['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=100'], variants:[], categoryId:1, categoryName:'Squishy', active:true, newArrival:true, featured:true, soldCount:47, description:'Set of 6 cat figurines', createdAt:'' },
  { id:4, name:'Teddy Bear Plush Buddy', price:280, stock:0, imageUrls:['https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=100'], variants:[], categoryId:2, categoryName:'Plushie', active:false, newArrival:false, featured:true, soldCount:203, description:'Cute teddy bear', createdAt:'' },
]

interface FormState { name:string; description:string; price:string; stock:string; categoryId:string; imageUrls:string; variants:string; active:boolean; newArrival:boolean; featured:boolean }
const EMPTY: FormState = { name:'', description:'', price:'', stock:'', categoryId:'', imageUrls:'', variants:'', active:true, newArrival:false, featured:false }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [keyword, setKeyword] = useState('')
  const [modal, setModal] = useState<'add'|'edit'|null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    productService.getAll().then(r => setProducts(r.data.data?.content ?? MOCK_P)).catch(() => setProducts(MOCK_P))
    categoryService.getAll().then(r => setCategories(r.data.data ?? [])).catch(() => {})
  }, [])

  const filtered = products.filter(p => !keyword || p.name.toLowerCase().includes(keyword.toLowerCase()))
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal('add') }
  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({ name:p.name, description:p.description, price:String(p.price), stock:String(p.stock),
      categoryId:String(p.categoryId), imageUrls:p.imageUrls.join('\n'), variants:p.variants.join(', '),
      active:p.active, newArrival:p.newArrival, featured:p.featured })
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Fill required fields'); return }
    setSaving(true)
    const payload = {
      name:form.name, description:form.description, price:Number(form.price), stock:Number(form.stock),
      categoryId:form.categoryId ? Number(form.categoryId) : null,
      imageUrls:form.imageUrls.split('\n').map(s=>s.trim()).filter(Boolean),
      variants:form.variants.split(',').map(s=>s.trim()).filter(Boolean),
      active:form.active, newArrival:form.newArrival, featured:form.featured,
    }
    try {
      if (editing) {
        await productService.update(editing.id, payload as unknown as FormData)
        setProducts(ps => ps.map(p => p.id === editing.id ? { ...p, ...payload } as Product : p))
        toast.success('Product updated!')
      } else {
        const r = await productService.create(payload as unknown as FormData)
        setProducts(ps => [...ps, r.data.data])
        toast.success('Product added!')
      }
    } catch {
      // demo: just close
    } finally { setSaving(false); setModal(null) }
  }

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"?`)) return
    try { await productService.delete(p.id) } catch {}
    setProducts(ps => ps.filter(x => x.id !== p.id))
    toast.success('Product deleted')
  }

  const handleToggle = async (p: Product) => {
    try { await productService.toggleActive(p.id) } catch {}
    setProducts(ps => ps.map(x => x.id === p.id ? { ...x, active: !x.active } : x))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-gray-800">Product Management</h1>
        <button onClick={openAdd} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm
                            focus:outline-none focus:border-pink-300"
            placeholder="Search products..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-400 font-semibold uppercase tracking-wide text-left">
              {['Product','Category','Price','Stock','Status','Sold',''].map((h,i) => (
                <th key={i} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrls[0]} alt={p.name} className="w-10 h-10 object-cover rounded-xl flex-shrink-0" />
                    <span className="font-semibold text-gray-700">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.categoryName}</td>
                <td className="px-4 py-3 font-bold text-pink-500">₱{p.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-yellow-500' : 'text-gray-700'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(p)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${p.active ? 'bg-pink-500' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.active ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.soldCount}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No products found</div>}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-gray-800">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
                <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Name *</label>
                  <input className="input-field" placeholder="Product name" value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
                  <textarea className="input-field resize-none h-20" placeholder="Product description" value={form.description} onChange={set('description')} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Price (₱) *</label>
                    <input type="number" className="input-field" placeholder="189" value={form.price} onChange={set('price')} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Stock *</label>
                    <input type="number" className="input-field" placeholder="10" value={form.stock} onChange={set('stock')} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
                    <select className="input-field" value={form.categoryId} onChange={set('categoryId')}>
                      <option value="">None</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Image URLs (one per line)</label>
                  <textarea className="input-field resize-none h-20 text-xs" placeholder="https://..." value={form.imageUrls} onChange={set('imageUrls')} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Variants (comma separated)</label>
                  <input className="input-field" placeholder="Pink, Yellow, Mint" value={form.variants} onChange={set('variants')} />
                </div>
                <div className="flex gap-4 pt-1">
                  {([['active','Active'],['newArrival','New Arrival'],['featured','Featured']] as const).map(([k, label]) => (
                    <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="accent-pink-500 w-4 h-4"
                        checked={form[k] as boolean}
                        onChange={e => setForm(f => ({ ...f, [k]: e.target.checked }))} />
                      <span className="font-semibold text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setModal(null)} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : modal === 'add' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
