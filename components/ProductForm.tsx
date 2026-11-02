'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductForm({ 
  initialBrands = [], 
  initialCategories = [] 
}: { 
  initialBrands: any[], 
  initialCategories: any[] 
}) {
  const [brands] = useState<any[]>(initialBrands)
  const [categories] = useState<any[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    brand_id: '',
    category_id: '',
    model: '',
    year: '',
    reference_oem: '',
    price: '',
    condition: 'Usado',
    image_url: '',
    description: ''
  })

  // (Nota: Removemos o useEffect e o fetchMetadata daqui, pois os dados já vêm prontos do servidor!)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')

    const { error } = await supabase.from('products').insert([
      {
        title: formData.title,
        brand_id: formData.brand_id || null,
        category_id: formData.category_id || null,
        model: formData.model,
        year: formData.year ? parseInt(formData.year) : null,
        reference_oem: formData.reference_oem,
        price: parseFloat(formData.price),
        condition: formData.condition,
        image_url: formData.image_url,
        description: formData.description
      }
    ])

    setLoading(false)
    if (error) {
      alert('Erro ao inserir produto: ' + error.message)
    } else {
      setSuccessMessage('Peça inserida com sucesso no stock!')
      setFormData({
        title: '',
        brand_id: '',
        category_id: '',
        model: '',
        year: '',
        reference_oem: '',
        price: '',
        condition: 'Usado',
        image_url: '',
        description: ''
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-slate-900 text-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-6">Inserir Nova Peça / Stock</h2>
      
      {successMessage && (
        <div className="p-4 mb-4 text-green-300 bg-green-900/50 rounded-md">
          {successMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300">Título da Peça</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
          placeholder="Ex: Para-choques Dianteiro"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Marca ({brands.length} disponíveis)</label>
          <select
            value={formData.brand_id}
            onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
            className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
          >
            <option value="">Selecione a marca...</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Categoria ({categories.length} disponíveis)</label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
          >
            <option value="">Selecione a categoria...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Modelo</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
            placeholder="Ex: Série 3 E90"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Ano</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
            placeholder="Ex: 2010"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Estado</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
          >
            <option value="Usado">Usado</option>
            <option value="Novo">Novo</option>
            <option value="Recondicionado">Recondicionado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Referência OEM</label>
          <input
            type="text"
            value={formData.reference_oem}
            onChange={(e) => setFormData({ ...formData, reference_oem: e.target.value })}
            className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
            placeholder="Ex: 51117181347"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Preço (€)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">URL da Imagem</label>
        <input
          type="text"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
          placeholder="https://exemplo.com/foto-peca.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">Descrição / Observações</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 shadow-sm border p-2 text-white"
          placeholder="Detalhes adicionais sobre o estado da peça..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 text-white p-3 rounded-md font-semibold hover:bg-cyan-700 transition cursor-pointer"
      >
        {loading ? 'A guardar...' : 'Inserir Peça no Stock'}
      </button>
    </form>
  )
}