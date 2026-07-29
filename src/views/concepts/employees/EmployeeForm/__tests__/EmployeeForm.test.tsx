import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EmployeeForm from '../EmployeeForm'

vi.mock('@/utils/hooks/useTranslation', () => ({
  default: () => ({ t: (key: string, fallback: string) => fallback }),
}))

vi.mock('@/utils/hooks/useLayout', () => ({
  default: () => ({ type: 'default' }),
}))

vi.mock('@/components/ui/Form', () => ({
  Form: ({ children, onSubmit }: any) => (
    <form
      onSubmit={(e: any) => {
        e.preventDefault()
        onSubmit(e)
      }}
      data-testid="form"
    >
      {children}
    </form>
  ),
  FormItem: ({ children, label }: any) => (
    <div data-testid="form-item">
      {label && <label>{label}</label>}
      {children}
    </div>
  ),
  FormContainer: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form')
  const originalUseForm = actual.useForm
  return {
    ...actual,
    useForm: (options?: any) => {
      const result = originalUseForm(options)
      return {
        ...result,
        handleSubmit: (callback: any) => (e: any) => {
          e?.preventDefault?.()
          const values = options?.defaultValues || {}
          callback(values)
        },
      }
    },
  }
})

vi.mock('@/components/shared/Container', () => ({
  default: ({ children }: any) => <div data-testid="container">{children}</div>,
}))

vi.mock('@/components/template/BottomStickyBar', () => ({
  default: ({ children }: any) => <div data-testid="bottom-bar">{children}</div>,
}))

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, type, icon, ...props }: any) => (
    <button type={type || 'button'} onClick={onClick} data-testid="button" {...props}>
      {icon}{children}
    </button>
  ),
}))

vi.mock('@/components/ui/Steps', () => {
  const Item = ({ title, customIcon }: any) => (
    <div data-testid="step-item">
      {customIcon}{title}
    </div>
  )
  const Steps = ({ current, children }: any) => (
    <div data-testid="steps" data-current={current}>{children}</div>
  )
  Steps.Item = Item
  return { default: Steps, Item }
})

vi.mock('@/components/ui/Avatar', () => ({
  default: ({ src, icon, ...props }: any) => (
    <div data-testid="avatar" {...props}>{icon}</div>
  ),
}))

vi.mock('../BasicInfoSection', () => ({
  default: () => <div data-testid="basic-info-section">BasicInfo</div>,
}))

vi.mock('../ContactSection', () => ({
  default: () => <div data-testid="contact-section">Contact</div>,
}))

vi.mock('../LaborSection', () => ({
  default: () => <div data-testid="labor-section">Labor</div>,
}))

vi.mock('../EducationSection', () => ({
  default: () => <div data-testid="education-section">Education</div>,
}))

vi.mock('../UniformSection', () => ({
  default: () => <div data-testid="uniform-section">Uniform</div>,
}))

vi.mock('../ChildrenSection', () => ({
  default: () => <div data-testid="children-section">Children</div>,
}))

vi.mock('../EmergencyContactSection', () => ({
  default: () => <div data-testid="emergency-contact-section">Emergency</div>,
}))

vi.mock('../NotesSection', () => ({
  default: () => <div data-testid="notes-section">Notes</div>,
}))

vi.mock('@/services/EmployeesService', () => ({
  apiUploadEmployeePhoto: vi.fn().mockResolvedValue({ photoUrl: 'test.jpg' }),
}))

describe('EmployeeForm', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('should render the form with all steps indicator', () => {
    render(<EmployeeForm onFormSubmit={vi.fn()} />)

    expect(screen.getByTestId('form')).toBeInTheDocument()
    expect(screen.getByTestId('steps')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-bar')).toBeInTheDocument()
  })

  it('should render BasicInfoSection on step 0', () => {
    render(<EmployeeForm onFormSubmit={vi.fn()} />)

    expect(screen.getByTestId('basic-info-section')).toBeInTheDocument()
    expect(screen.queryByTestId('contact-section')).not.toBeInTheDocument()
    expect(screen.queryByTestId('labor-section')).not.toBeInTheDocument()
  })

  it('should navigate to next step when Next is clicked', () => {
    render(<EmployeeForm onFormSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('Next'))

    expect(screen.queryByTestId('basic-info-section')).not.toBeInTheDocument()
    expect(screen.getByTestId('contact-section')).toBeInTheDocument()
  })

  it('should navigate back to previous step', () => {
    render(<EmployeeForm onFormSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Back'))

    expect(screen.getByTestId('basic-info-section')).toBeInTheDocument()
  })

  it('should show all additional sections on the last step', () => {
    render(<EmployeeForm onFormSubmit={vi.fn()} />)

    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))

    expect(screen.getByTestId('education-section')).toBeInTheDocument()
    expect(screen.getByTestId('uniform-section')).toBeInTheDocument()
    expect(screen.getByTestId('children-section')).toBeInTheDocument()
    expect(screen.getByTestId('emergency-contact-section')).toBeInTheDocument()
    expect(screen.getByTestId('notes-section')).toBeInTheDocument()
  })

  it('should call onFormSubmit with form values on submit', () => {
    const onSubmit = vi.fn()
    const defaultValues = {
      fullName: 'John Doe',
      statusId: 'status-1',
    }
    render(
      <EmployeeForm onFormSubmit={onSubmit} defaultValues={defaultValues as any}>
        <button type="submit" data-testid="submit-btn">Save</button>
      </EmployeeForm>,
    )

    fireEvent.submit(screen.getByTestId('form'))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should render children in the bottom bar on last step', () => {
    render(
      <EmployeeForm onFormSubmit={vi.fn()}>
        <button type="submit" data-testid="submit-btn">Save</button>
      </EmployeeForm>,
    )

    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))

    expect(screen.getByTestId('submit-btn')).toBeInTheDocument()
  })

  it('should render avatar with default employee text', () => {
    render(<EmployeeForm onFormSubmit={vi.fn()} />)

    expect(screen.getByTestId('avatar')).toBeInTheDocument()
    expect(screen.getByText('Employee')).toBeInTheDocument()
  })

  it('should show "Add photo after creating" text for new employee', () => {
    render(<EmployeeForm onFormSubmit={vi.fn()} newEmployee={true} />)

    expect(screen.getByText('Add photo after creating')).toBeInTheDocument()
  })
})
