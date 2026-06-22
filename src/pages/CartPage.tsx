import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { useCart } from '../context/CartContext'

interface CheckoutValues {
  name: string
  address: string
  email: string
  cardNumber: string
  expiry: string
  cvv: string
}

interface CheckoutErrors {
  name?: string
  address?: string
  email?: string
  cardNumber?: string
  expiry?: string
  cvv?: string
}

const initialValues: CheckoutValues = {
  name: '',
  address: '',
  email: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

export function CartPage() {
  const { items, removeFromCart } = useCart()
  const [values, setValues] = useState<CheckoutValues>(initialValues)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target

    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 16)
      const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ')
      setValues((currentValues) => ({ ...currentValues, cardNumber: formatted }))
      return
    }

    if (name === 'expiry') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 4)
      const formatted =
        digitsOnly.length > 2 ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}` : digitsOnly
      setValues((currentValues) => ({ ...currentValues, expiry: formatted }))
      return
    }

    if (name === 'cvv') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 4)
      setValues((currentValues) => ({ ...currentValues, cvv: digitsOnly }))
      return
    }

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const validate = (): CheckoutErrors => {
    const nextErrors: CheckoutErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

    if (!values.address.trim()) {
      nextErrors.address = 'Delivery address is required.'
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    const cardDigits = values.cardNumber.replace(/\s/g, '')
    if (!/^\d{16}$/.test(cardDigits)) {
      nextErrors.cardNumber = 'Card number must be 16 digits.'
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry)) {
      nextErrors.expiry = 'Expiration must be in MM/YY format.'
    }

    if (!/^\d{3,4}$/.test(values.cvv)) {
      nextErrors.cvv = 'CVV must be 3 or 4 digits.'
    }

    return nextErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      setValues(initialValues)
    } else {
      setSubmitted(false)
    }
  }

  if (items.length === 0) {
    return (
      <Card title="Your Cart">
        <p className="section-intro">Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </Card>
    )
  }

  return (
    <Card title="Your Cart">
      <ul className="cart-list">
        {items.map((item) => {
          const lineTotal = item.price * item.quantity

          return (
            <li key={item.id} className="cart-item">
              <div className="cart-item-main">
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-thumb product-image cart-thumb"
                  loading="lazy"
                />
                <div>
                  <p className="product-category">{item.category}</p>
                  <h3 className="product-title">{item.name}</h3>
                </div>
              </div>
              <div className="cart-item-details">
                <p>Qty: {item.quantity}</p>
                <p>${item.price.toFixed(0)} each</p>
                <p className="product-price">${lineTotal.toFixed(0)}</p>
                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="cart-total">Total: ${totalCost.toFixed(0)}</p>
      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        <p>Please provide payment information:</p>
        <label htmlFor="checkout-name">Name</label>
        <input
          id="checkout-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          autoComplete="name"
          aria-describedby={errors.name ? 'checkout-name-error' : undefined}
          required
        />
        {errors.name && (
          <p id="checkout-name-error" role="alert">
            {errors.name}
          </p>
        )}

        <label htmlFor="checkout-address">Delivery Address</label>
        <textarea
          id="checkout-address"
          name="address"
          value={values.address}
          onChange={handleChange}
          autoComplete="street-address"
          aria-describedby={errors.address ? 'checkout-address-error' : undefined}
          required
        />
        {errors.address && (
          <p id="checkout-address-error" role="alert">
            {errors.address}
          </p>
        )}

        <label htmlFor="checkout-email">Email Address</label>
        <input
          id="checkout-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          aria-describedby={errors.email ? 'checkout-email-error' : undefined}
          required
        />
        {errors.email && (
          <p id="checkout-email-error" role="alert">
            {errors.email}
          </p>
        )}

        <label htmlFor="checkout-card-number">Credit Card Number</label>
        <input
          id="checkout-card-number"
          name="cardNumber"
          type="text"
          value={values.cardNumber}
          onChange={handleChange}
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          autoComplete="cc-number"
          aria-describedby={errors.cardNumber ? 'checkout-card-number-error' : undefined}
          required
        />
        {errors.cardNumber && (
          <p id="checkout-card-number-error" role="alert">
            {errors.cardNumber}
          </p>
        )}

        <div className="checkout-card-row">
          <div className="checkout-card-field">
            <label htmlFor="checkout-expiry">Expiration Date</label>
            <input
              id="checkout-expiry"
              name="expiry"
              type="text"
              value={values.expiry}
              onChange={handleChange}
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              aria-describedby={errors.expiry ? 'checkout-expiry-error' : undefined}
              required
            />
            {errors.expiry && (
              <p id="checkout-expiry-error" role="alert">
                {errors.expiry}
              </p>
            )}
          </div>
          <div className="checkout-card-field">
            <label htmlFor="checkout-cvv">CVV</label>
            <input
              id="checkout-cvv"
              name="cvv"
              type="text"
              value={values.cvv}
              onChange={handleChange}
              inputMode="numeric"
              autoComplete="cc-csc"
              aria-describedby={errors.cvv ? 'checkout-cvv-error' : undefined}
              required
            />
            {errors.cvv && (
              <p id="checkout-cvv-error" role="alert">
                {errors.cvv}
              </p>
            )}
          </div>
        </div>

        <button type="submit" className="submit-order">
          Submit Order
        </button>
      </form>
      {submitted && <p>Order submitted successfully.</p>}
    </Card>
  )
}
