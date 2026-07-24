import { useEffect, useState, useCallback, useRef } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import Button from '@/components/ui/Button'
import Steps from '@/components/ui/Steps'
import BasicInfoSection from './BasicInfoSection'
import ContactSection from './ContactSection'
import LaborSection from './LaborSection'

import EducationSection from './EducationSection'
import UniformSection from './UniformSection'
import ChildrenSection from './ChildrenSection'
import EmergencyContactSection from './EmergencyContactSection'
import NotesSection from './NotesSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbUser, TbPhone, TbBriefcase, TbDots, TbArrowNarrowLeft } from 'react-icons/tb'
import type { CommonProps } from '@/@types/common'
import type { EmployeeFormSchema } from './types'

const { Item } = Steps

const STORAGE_KEY = 'employee_create_form'
const STORAGE_STEP_KEY = 'employee_create_step'

type EmployeeFormProps = {
    onFormSubmit: (values: EmployeeFormSchema) => void
    defaultValues?: EmployeeFormSchema
    newEmployee?: boolean
} & CommonProps

const EmployeeForm = (props: EmployeeFormProps) => {
    const { t } = useTranslation()
    const savedStep = props.newEmployee ? Number(sessionStorage.getItem(STORAGE_STEP_KEY) || 0) : 0
    const [step, setStep] = useState(savedStep)
    const persisted = useRef(false)

    const steps = [
        { title: t('employeeForm.personalInfo', 'Personal'), icon: <TbUser /> },
        { title: t('employeeForm.contactInfo', 'Contact'), icon: <TbPhone /> },
        { title: t('employeeForm.laborInfo', 'Labor'), icon: <TbBriefcase /> },
        { title: t('employeeForm.additionalInfo', 'Additional'), icon: <TbDots /> },
    ]

    const validationSchema = z.object({
        fullName: z.string().min(1, { message: t('employeeForm.fullNameRequired', 'Full name is required') }),
        email: z.string().min(1, { message: t('employeeForm.emailRequired', 'Email is required') }).email({ message: t('employeeForm.invalidEmail', 'Invalid email') }),
        phone: z.string().optional().or(z.literal('')),
        phoneExtension: z.string().optional().or(z.literal('')),
        corporatePhone: z.string().optional().or(z.literal('')),
        satellitePhone: z.string().optional().or(z.literal('')),
        roomPhone: z.string().optional().or(z.literal('')),
        mobilePhone: z.string().optional().or(z.literal('')),
        address: z.string().optional().or(z.literal('')),
        birthDate: z.string().optional().or(z.literal('')),
        documentId: z.string().optional().or(z.literal('')),
        gender: z.string().optional().or(z.literal('')),
        departmentId: z.string().optional().or(z.literal('')),
        position: z.string().optional().or(z.literal('')),
        contractingCompany: z.string().optional().or(z.literal('')),
        hireDate: z.string().optional().or(z.literal('')),
        endDate: z.string().optional().or(z.literal('')),
        salary: z.number().optional(),
        supervisorId: z.string().optional().or(z.literal('')),
        statusId: z.string().min(1, { message: t('employeeForm.statusRequired', 'Status is required') }),
        isActive: z.boolean(),
        nationality: z.string().optional().or(z.literal('')),
        maritalStatus: z.string().optional().or(z.literal('')),
        placeOfBirth: z.string().optional().or(z.literal('')),
        educationLevel: z.string().optional().or(z.literal('')),
        degree: z.string().optional().or(z.literal('')),
        institution: z.string().optional().or(z.literal('')),
        graduationYear: z.string().optional().or(z.literal('')),
        shirtSize: z.string().optional().or(z.literal('')),
        pantSize: z.string().optional().or(z.literal('')),
        shoeSize: z.string().optional().or(z.literal('')),
        jacketSize: z.string().optional().or(z.literal('')),
        helmetSize: z.string().optional().or(z.literal('')),
        notes: z.string().optional().or(z.literal('')),
        children: z.array(z.object({
            name: z.string().min(1, { message: t('employeeForm.childNameRequired', 'Child name is required') }),
            birthDate: z.string().optional().or(z.literal('')),
            gender: z.string().optional().or(z.literal('')),
        })),
        emergencyContacts: z.array(z.object({
            name: z.string().min(1, { message: t('employeeForm.emergencyContactNameRequired', 'Name is required') }),
            phone: z.string().min(1, { message: t('employeeForm.emergencyContactPhoneRequired', 'Phone is required') }),
            relationship: z.string().min(1, { message: t('employeeForm.emergencyContactRelationshipRequired', 'Relationship is required') }),
        })),
    })

    const { onFormSubmit, defaultValues = {}, newEmployee = false, children } = props

    const restored = newEmployee && !persisted.current
        ? (() => {
            const saved = sessionStorage.getItem(STORAGE_KEY)
            if (saved) {
                persisted.current = true
                try { return JSON.parse(saved) } catch { return {} }
            }
            return {}
        })()
        : {}

    const {
        handleSubmit,
        reset,
        formState: { errors, isDirty },
        control,
    } = useForm<EmployeeFormSchema>({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            phoneExtension: '',
            corporatePhone: '',
            satellitePhone: '',
            roomPhone: '',
            mobilePhone: '',
            address: '',
            birthDate: '',
            documentId: '',
            gender: '',
            departmentId: '',
            position: '',
            contractingCompany: '',
            hireDate: '',
            endDate: '',
            salary: 0,
            supervisorId: '',
            statusId: '',
            isActive: true,
            nationality: '',
            maritalStatus: '',
            placeOfBirth: '',
            educationLevel: '',
            degree: '',
            institution: '',
            graduationYear: '',
            shirtSize: '',
            pantSize: '',
            shoeSize: '',
            jacketSize: '',
            helmetSize: '',
            notes: '',
            children: [],
            emergencyContacts: [],
            ...defaultValues,
            ...restored,
        },
        resolver: zodResolver(validationSchema) as any,
    })

    const formValues = useWatch({ control })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    useEffect(() => {
        if (newEmployee) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formValues))
            sessionStorage.setItem(STORAGE_STEP_KEY, String(step))
        }
    }, [formValues, step, newEmployee])

    const onSubmit = useCallback((values: EmployeeFormSchema) => {
        sessionStorage.removeItem(STORAGE_KEY)
        sessionStorage.removeItem(STORAGE_STEP_KEY)
        onFormSubmit?.(values)
    }, [onFormSubmit])

    const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1))
    const handlePrev = () => setStep((s) => Math.max(s - 1, 0))

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col gap-4">
                    <Steps current={step}>
                        {steps.map((s, i) => (
                            <Item key={i} title={s.title} customIcon={s.icon} />
                        ))}
                    </Steps>

                    <div className="mt-4">
                        {step === 0 && <BasicInfoSection control={control} errors={errors} />}
                        {step === 1 && <ContactSection control={control} errors={errors} />}
                        {step === 2 && <LaborSection control={control} errors={errors} />}
                        {step === 3 && (
                            <div className="flex flex-col gap-4">
                                <EducationSection control={control} errors={errors} />
                                <EmergencyContactSection control={control} errors={errors} />
                                <UniformSection control={control} errors={errors} />
                                <ChildrenSection control={control} errors={errors} />
                                <NotesSection control={control} errors={errors} />
                            </div>
                        )}
                    </div>
                </div>
            </Container>
            <BottomStickyBar>
                {step < steps.length - 1 ? (
                    <div className="flex items-center justify-between px-8">
                        <div>
                            {step > 0 && (
                                <Button variant="plain" icon={<TbArrowNarrowLeft />} onClick={handlePrev}>
                                    {t('common.back', 'Back')}
                                </Button>
                            )}
                        </div>
                        <Button type="button" variant="solid" onClick={handleNext}>
                            {t('common.next', 'Next')}
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between px-8">
                        <Button variant="plain" icon={<TbArrowNarrowLeft />} onClick={handlePrev}>
                            {t('common.back', 'Back')}
                        </Button>
                        {children}
                    </div>
                )}
            </BottomStickyBar>
        </Form>
    )
}

export default EmployeeForm
