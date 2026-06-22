import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { useCart } from '../context/CartContext'
import { useFetch } from '../hooks/useFetch'
import type { Accessory } from '../types'

export function ProductListPage() {
  const { data, loading, error } = useFetch<Accessory[]>('/data/accessories.json')
  const { addToCart } = useCart()
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const toCategoryClass = (category: string) =>
    category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')

  if (loading) {
    return <p role="status">Loading accessories...</p>
  }

  if (error) {
    return <p role="alert">Failed to load products: {error}</p>
  }

  return (
    <Card title="Coffee Brewing Tools & Accessories">
      <p className="section-intro">
        Curated products for precise extraction and better home brewing.
      </p>
      <ul className="product-list">
        {data?.map((product) => (
          <li key={product.id} className="product-item">
            {failedImages[product.id] ? (
              <div
                className={`product-thumb thumb-${toCategoryClass(product.category)}`}
                aria-hidden="true"
              />
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="product-thumb product-image"
                loading="lazy"
                onError={() =>
                  setFailedImages((currentState) => ({ ...currentState, [product.id]: true }))
                }
              />
            )}
            <p className="product-category">{product.category}</p>
            <h3 className="product-title">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(0)}</p>
            <div className="actions">
              <Link to={`/product/${product.id}`}>View details</Link>
              <button type="button" onClick={() => addToCart(product)}>
                Add to cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
