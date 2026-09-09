import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '@/components/ui/confirm-dialog'

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    render(
      <ConfirmDialog open={false} title="Delete this?" onConfirm={jest.fn()} onCancel={jest.fn()} />,
    )
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('renders the title and description when open', () => {
    render(
      <ConfirmDialog
        open
        title="Delete this testimonial?"
        description="This can't be undone."
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    )
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Delete this testimonial?')).toBeInTheDocument()
    expect(screen.getByText("This can't be undone.")).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = jest.fn()
    render(<ConfirmDialog open title="Delete this?" confirmLabel="Delete" onConfirm={onConfirm} onCancel={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = jest.fn()
    render(<ConfirmDialog open title="Delete this?" onConfirm={jest.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when clicking the backdrop', () => {
    const onCancel = jest.fn()
    const { container } = render(<ConfirmDialog open title="Delete this?" onConfirm={jest.fn()} onCancel={onCancel} />)
    fireEvent.click(container.querySelector('[role="presentation"]') as HTMLElement)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('does not call onCancel when clicking inside the dialog', () => {
    const onCancel = jest.fn()
    render(<ConfirmDialog open title="Delete this?" onConfirm={jest.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('alertdialog'))
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when Escape is pressed', () => {
    const onCancel = jest.fn()
    render(<ConfirmDialog open title="Delete this?" onConfirm={jest.fn()} onCancel={onCancel} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
