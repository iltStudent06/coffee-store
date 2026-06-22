import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactPage } from '../pages/ContactPage'

describe('ContactPage', () => {
  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/message is required/i)).toBeInTheDocument()
  })

  it('submits successfully with valid input', async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    await user.type(screen.getByLabelText(/name/i), 'Taylor')
    await user.type(screen.getByLabelText(/email/i), 'taylor@example.com')
    await user.type(screen.getByLabelText(/message/i), 'I need filters for pour over.')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText(/thanks! we will get back to you shortly/i)).toBeInTheDocument()
  })
})
