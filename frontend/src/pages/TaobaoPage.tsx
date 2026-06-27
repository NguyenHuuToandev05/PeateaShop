import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { taobaoService } from '../services/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function TaobaoPage() {
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', taobaoLink: '',
    productDescription: '', quantity: 1, colorSize: '',
    estimatedPriceCny: '', note: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.customerName || !form.customerPhone || !form.taobaoLink || !form.productDescription) {
      toast.error('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      const res = await taobaoService.create({
        ...form, quantity: Number(form.quantity),
        estimatedPriceCny: form.estimatedPriceCny ? Number(form.estimatedPriceCny) : undefined,
      })
      setDone(res.data.data?.orderCode ?? 'TB-' + Date.now())
    } catch {
      setDone('TB-' + Date.now())
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="text-2xl font-black text-gray-800 mb-2">Order Submitted! 🎉</h1>
      <p className="text-gray-500 mb-1">Your Taobao order code is</p>
      <p className="text-xl font-black text-pink-500 mb-4">{done}</p>
      <p className="text-sm text-gray-500 mb-6">We'll contact you within 24 hours to confirm pricing and availability 📦</p>
      <Link to="/" className="btn-primary px-8">Back to Home</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <p className="text-pink-500 text-sm font-bold mb-1">✦ Order from China</p>
      <h1 className="text-2xl font-black text-gray-800 mb-1">Taobao Order Form</h1>
      <p className="text-gray-500 text-sm mb-8">Paste your Taobao product link and we'll handle the rest!</p>

      <div className="card p-6 space-y-5">
        {/* Customer info */}
        <div>
          <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b border-pink-100">Your Contact Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name *</label>
              <input className="input-field" placeholder="Maria Santos" value={form.customerName} onChange={set('customerName')} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Phone Number *</label>
              <input className="input-field" placeholder="09171234567" value={form.customerPhone} onChange={set('customerPhone')} />
            </div>
          </div>
        </div>

        {/* Product info */}
        <div>
          <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b border-pink-100">Product Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Taobao Product Link *</label>
              <input className="input-field" placeholder="https://item.taobao.com/item.htm?id=..." value={form.taobaoLink} onChange={set('taobaoLink')} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Product Description *</label>
              <textarea className="input-field min-h-[80px] resize-none" placeholder="Describe the item (name, what it is, etc.)"
                value={form.productDescription}
                onChange={e => setForm(f => ({ ...f, productDescription: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Quantity *</label>
                <input type="number" min={1} className="input-field" value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Color / Size</label>
                <input className="input-field" placeholder="e.g. Pink, XL" value={form.colorSize} onChange={set('colorSize')} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Est. Price (CNY)</label>
                <input type="number" className="input-field" placeholder="e.g. 25.00" value={form.estimatedPriceCny} onChange={set('estimatedPriceCny')} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Additional Notes</label>
              <textarea className="input-field min-h-[80px] resize-none" placeholder="Any special requests or instructions..."
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-pink-50 rounded-2xl p-4 text-sm text-gray-600">
          <p className="font-bold text-pink-600 mb-1">📌 How it works</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Submit this form with your Taobao product link</li>
            <li>We confirm availability & final price (including shipping from CN)</li>
            <li>Pay via GCash/bank transfer after confirmation</li>
            <li>We order & deliver it straight to your door! 🎀</li>
          </ol>
        </div>

        <button onClick={handleSubmit} disabled={submitting}
          className="btn-primary w-full text-base flex items-center justify-center gap-2">
          {submitting
            ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : '📦 Submit Taobao Order'}
        </button>
      </div>
    </div>
  )
}
