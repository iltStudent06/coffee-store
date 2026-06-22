import { render, screen } from '@testing-library/react'
import { Card } from '../components/Card'

describe('Card', () => {
  it('renders title and children content', () => {
    render(
      <Card title="Wrapper title">
        <p>Wrapped content</p>
      </Card>,
    )

    expect(screen.getByRole('heading', { name: /wrapper title/i })).toBeInTheDocument()
    expect(screen.getByText(/wrapped content/i)).toBeInTheDocument()
  })
})
