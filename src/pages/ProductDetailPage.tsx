import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { useCart } from '../context/CartContext'
import { useFetch } from '../hooks/useFetch'
import type { Accessory } from '../types'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const { data, loading, error } = useFetch<Accessory[]>('/data/accessories.json')
  const { addToCart } = useCart()
  const [imageFailed, setImageFailed] = useState(false)

  const toCategoryClass = (category: string) =>
    category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')

  if (loading) {
    return <p role="status">Loading product details...</p>
  }

  if (error) {
    return <p role="alert">Unable to fetch product details: {error}</p>
  }

  const product = data?.find((item) => item.id === productId)

  if (!product) {
    return (
      <Card title="Product Not Found">
        <p>We could not find that accessory.</p>
        <Link to="/">Back to products</Link>
      </Card>
    )
  }

  return (
    <Card title={product.name}>
      {imageFailed ? (
        <div
          className={`product-thumb detail-thumb thumb-${toCategoryClass(product.category)}`}
          aria-hidden="true"
        />
      ) : (
        <img
          src={product.image}
          alt={product.name}
          className="product-thumb detail-thumb product-image"
          onError={() => setImageFailed(true)}
        />
      )}
      <p className="product-category">{product.category}</p>
      <p>{product.description}</p>
      <p>In stock: {product.stock}</p>
      <p className="product-price">${product.price.toFixed(0)}</p>
      <div className="actions">
        <button type="button" onClick={() => addToCart(product)}>
          Add to cart
        </button>
        <Link to="/">Back to products</Link>
      </div>
    </Card>
  )
}
