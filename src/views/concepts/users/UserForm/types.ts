import type { Control, FieldErrors } from 'react-hook-form'

export type UserFormSchema = {
    email: string
    password: string
    displayName: string
    photoUrl: string
    role: 'admin' | 'recruiter' | 'candidate'
    isActive: boolean
}

export type FormSectionBaseProps = {
    control: Control<UserFormSchema>
    errors: FieldErrors<UserFormSchema>
}
