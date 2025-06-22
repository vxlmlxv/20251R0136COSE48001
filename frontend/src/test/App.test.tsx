import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Simple test component
function TestComponent() {
  return <div>Test Component</div>
}

describe('Frontend Tests', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    )
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('basic math works', () => {
    expect(2 + 2).toBe(4)
  })
})
