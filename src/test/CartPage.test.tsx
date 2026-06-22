import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { CartPage } from '../pages/CartPage'

const mockUseCart = vi.fn()

vi.mock('../context/CartContext', () => ({
  useCart: () => mockUseCart(),
}))

describe('CartPage', () => {
  beforeEach(() => {
    mockUseCart.mockReset()
  })

  it('shows empty cart state when no items are in cart', () => {
    mockUseCart.mockReturnValue({
      items: [],
      removeFromCart: vi.fn(),
    })

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument()
  })

  it('removes an item when remove is clicked', async () => {
    const user = userEvent.setup()
    const removeFromCart = vi.fn()

    mockUseCart.mockReturnValue({
      items: [
        {
          id: 'grinder-1',
          name: 'Burr Grinder',
          category: 'Grinders',
          price: 50,
          description: 'Precise grind size control.',
          stock: 12,
          image: '/images/grinder.jpg',
          quantity: 2,
        },
      ],
      removeFromCart,
    })

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/total: \$100/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(removeFromCart).toHaveBeenCalledWith('grinder-1')
  })

  it('shows checkout validation errors and submits successfully with valid values', async () => {
    const user = userEvent.setup()

    mockUseCart.mockReturnValue({
      items: [
        {
          id: 'kettle-1',
          name: 'Gooseneck Kettle',
          category: 'Kettles',
          price: 85,
          description: 'Pour-over precision kettle.',
          stock: 8,
          image: '/images/kettle.jpg',
          quantity: 1,
        },
      ],
      removeFromCart: vi.fn(),
    })

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /submit order/i }))

    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/delivery address is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument()
    expect(screen.getByText(/card number must be 16 digits/i)).toBeInTheDocument()
    expect(screen.getByText(/expiration must be in mm\/yy format/i)).toBeInTheDocument()
    expect(screen.getByText(/cvv must be 3 or 4 digits/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/name/i), 'Jordan')
    await user.type(screen.getByLabelText(/delivery address/i), '123 Roast Lane')
    await user.type(screen.getByLabelText(/email address/i), 'jordan@example.com')
    await user.type(screen.getByLabelText(/credit card number/i), '4242424242424242')
    await user.type(screen.getByLabelText(/expiration date/i), '1228')
    await user.type(screen.getByLabelText(/^cvv$/i), '123')

    await user.click(screen.getByRole('button', { name: /submit order/i }))

    expect(screen.getByText(/order submitted successfully/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toHaveValue('')
  })

  it('shows an error when email format is invalid', async () => {
    const user = userEvent.setup()

    mockUseCart.mockReturnValue({
      items: [
        {
          id: 'scale-1',
          name: 'Digital Scale',
          category: 'Scales',
          price: 30,
          description: 'Precise brewing scale.',
          stock: 20,
          image: '/images/scale.jpg',
          quantity: 1,
        },
      ],
      removeFromCart: vi.fn(),
    })

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/name/i), 'Alex')
    await user.type(screen.getByLabelText(/delivery address/i), '45 Bean Street')
    await user.type(screen.getByLabelText(/email address/i), 'invalid-email')
    await user.type(screen.getByLabelText(/credit card number/i), '4242424242424242')
    await user.type(screen.getByLabelText(/expiration date/i), '1228')
    await user.type(screen.getByLabelText(/^cvv$/i), '123')

    await user.click(screen.getByRole('button', { name: /submit order/i }))

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    expect(screen.queryByText(/order submitted successfully/i)).not.toBeInTheDocument()
  })
})
