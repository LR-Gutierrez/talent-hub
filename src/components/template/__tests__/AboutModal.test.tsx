import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/components/ui', () => ({
  Dialog: ({ isOpen, children }: any) => (isOpen ? <div data-testid="dialog">{children}</div> : null),
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('@/components/ui/Dialog', () => ({
  default: ({ isOpen, children }: any) => (isOpen ? <div data-testid="dialog">{children}</div> : null),
}))

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('@/constants/app.constant', () => ({
  APP_NAME: 'TalentHub',
}))

vi.mock('@/utils/hooks/useTranslation', () => ({
  default: () => ({ t: (key: string, fallback: string) => fallback }),
}))

vi.mock('@/components/ui/StatusIcon', () => ({
  default: () => <span data-testid="status-icon">StatusIcon</span>,
}))

vi.mock('@/components/ui/Notification', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('react-icons/hi', () => ({
  HiOutlineInformationCircle: () => <span data-testid="info-icon">Info</span>,
}))

vi.mock('react-icons/fa', () => ({
  FaLinkedin: () => <span data-testid="linkedin-icon">LinkedIn</span>,
  FaGithub: () => <span data-testid="github-icon">GitHub</span>,
  FaMapMarkerAlt: () => <span data-testid="marker-icon">Marker</span>,
}))

import AboutModal from '../AboutModal'

describe('AboutModal', () => {
  it('should render trigger link', () => {
    render(<AboutModal />)
    expect(screen.getByText('Acerca del sistema')).toBeInTheDocument()
  })

  it('should open dialog when trigger is clicked', () => {
    render(<AboutModal />)
    fireEvent.click(screen.getByText('Acerca del sistema'))
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
  })

  it('should show APP_NAME in dialog title', () => {
    render(<AboutModal />)
    fireEvent.click(screen.getByText('Acerca del sistema'))
    expect(screen.getByText(/Acerca de TalentHub/)).toBeInTheDocument()
  })

  it('should display developer name', () => {
    render(<AboutModal />)
    fireEvent.click(screen.getByText('Acerca del sistema'))
    expect(screen.getByText('Luis Angel Gutiérrez')).toBeInTheDocument()
  })

  it('should display Entendido button and close dialog on click', () => {
    render(<AboutModal />)
    fireEvent.click(screen.getByText('Acerca del sistema'))
    expect(screen.getByTestId('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Entendido'))
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
  })

  it('should render skill badges', () => {
    render(<AboutModal />)
    fireEvent.click(screen.getByText('Acerca del sistema'))
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('NestJS')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})
