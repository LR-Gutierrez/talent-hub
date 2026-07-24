import { useEffect, useState, useCallback, type ReactNode } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Table from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { FormItem, Form } from '@/components/ui/Form'
import { TbPencil, TbTrash, TbPlus, TbUpload, TbTrashOff } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import {
    apiGetCatalogs,
    apiCreateCatalog,
    apiUpdateCatalog,
    apiDeleteCatalog,
    apiUploadFlag,
    apiDeleteFlag,
} from '@/services/CatalogsService'

const { Tr, Th, Td, THead, TBody } = Table

type CatalogItem = {
    id: string
    name: string
    value?: string
    sortOrder: number
    isActive: boolean
    category?: string
    dialCode?: string
    displayName?: string
    translations?: Record<string, string>
}

type ExtraField = {
    key: string
    label: ReactNode
    render?: (value: string, item: CatalogItem) => ReactNode
    showInForm?: boolean
}

interface ImageUploadConfig {
    endpoint: string
    getImageUrl: (item: CatalogItem) => string
}

interface CatalogManagerProps {
    title: string
    endpoint: string
    showValue?: boolean
    extraFields?: ExtraField[]
    imageUpload?: ImageUploadConfig
    translatable?: boolean
}

const pageSizeOption = [
    { value: 5, label: '5 / page' },
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
]

const LOCALES = ['es', 'fr', 'it'] as const

const CatalogManager = ({ title, endpoint, showValue = false, extraFields = [], imageUpload, translatable = false }: CatalogManagerProps) => {
    const { t, i18n } = useTranslation()
    const locale = typeof i18n !== 'string' ? i18n.language : 'en'
    const [items, setItems] = useState<CatalogItem[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<CatalogItem | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    const loadItems = useCallback(() => {
        const params: Record<string, unknown> = { pageIndex, pageSize }
        if (locale !== 'en') params.locale = locale
        apiGetCatalogs<{ list: CatalogItem[]; total: number }>(endpoint, params).then((res) => {
            setItems(res.list)
            setTotal(res.total)
        })
    }, [endpoint, pageIndex, pageSize, locale])

    useEffect(() => {
        loadItems()
    }, [loadItems])

    const paginatedItems = items

    const shape: Record<string, z.ZodTypeAny> = {
        name: z.string().min(1, { message: 'Name is required' }),
    }
    if (showValue) shape.value = z.string().optional().or(z.literal(''))
    const formFields = extraFields.filter((f) => f.showInForm !== false)
    formFields.forEach((f) => {
        shape[f.key] = z.string().optional().or(z.literal(''))
    })
    if (translatable) {
        for (const l of LOCALES) {
            shape[`translation_${l}`] = z.string().optional().or(z.literal(''))
        }
    }
    const validationSchema = z.object(shape)

    type FormSchema = z.infer<typeof validationSchema>

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(validationSchema) as any,
    })

    const openEdit = (item: CatalogItem) => {
        setEditingItem(item)
        const defaults: Record<string, string> = { name: item.displayName || item.name }
        if (showValue) defaults.value = item.value || ''
        formFields.forEach((f) => {
            defaults[f.key] = String((item as Record<string, unknown>)[f.key] ?? '')
        })
        if (translatable) {
            const tr: Record<string, string> = item.translations ?? {}
            for (const l of LOCALES) {
                defaults[`translation_${l}`] = tr[l] || ''
            }
        }
        reset(defaults as FormSchema)
        if (imageUpload) {
            setPreviewUrl(imageUpload.getImageUrl(item))
        }
        setDialogOpen(true)
    }

    const openCreate = () => {
        setEditingItem(null)
        setPreviewUrl(null)
        const defaults: Record<string, string> = { name: '' }
        if (showValue) defaults.value = ''
        formFields.forEach((f) => {
            defaults[f.key] = ''
        })
        if (translatable) {
            for (const l of LOCALES) {
                defaults[`translation_${l}`] = ''
            }
        }
        reset(defaults as FormSchema)
        setDialogOpen(true)
    }

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)
        try {
            const data = { ...values } as Record<string, unknown>
            if (translatable) {
                const translations: Record<string, string> = {}
                for (const l of LOCALES) {
                    const key = `translation_${l}`
                    if (data[key]) translations[l] = data[key] as string
                    delete data[key]
                }
                if (Object.keys(translations).length > 0) data.translations = translations
            }
            if (editingItem) {
                await apiUpdateCatalog(endpoint, editingItem.id, data)
            } else {
                await apiCreateCatalog(endpoint, data)
            }
            setDialogOpen(false)
            setEditingItem(null)
            loadItems()
            toast.push(
                <Notification type="success">
                    {editingItem ? t('common.updated', 'Updated!') : t('common.created', 'Created!')}
                </Notification>,
                { placement: 'top-center' },
            )
        } catch {
            // handled by interceptor
        }
        setIsSubmitting(false)
    }

    const confirmDelete = (id: string) => {
        setDeletingId(id)
        setDeleteDialogOpen(true)
    }

    const handleDelete = async () => {
        if (!deletingId) return
        try {
            await apiDeleteCatalog(endpoint, deletingId)
            setDeleteDialogOpen(false)
            setDeletingId(null)
            loadItems()
            toast.push(
                <Notification type="success">{t('common.deleted', 'Deleted!')}</Notification>,
                { placement: 'top-center' },
            )
        } catch {
            toast.push(
                <Notification type="danger">{t('common.failedToDelete', 'Failed to delete')}</Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !editingItem || !imageUpload) return
        setUploading(true)
        try {
            const { flagUrl } = await apiUploadFlag(imageUpload.endpoint, editingItem.id, file)
            setPreviewUrl(flagUrl)
            loadItems()
            toast.push(
                <Notification type="success">{t('common.uploaded', 'Uploaded!')}</Notification>,
                { placement: 'top-center' },
            )
        } catch {
            toast.push(
                <Notification type="danger">{t('common.failedToUpload', 'Upload failed')}</Notification>,
                { placement: 'top-center' },
            )
        }
        setUploading(false)
        e.target.value = ''
    }

    const handleDeleteFlag = async () => {
        if (!editingItem || !imageUpload) return
        try {
            await apiDeleteFlag(imageUpload.endpoint, editingItem.id)
            setPreviewUrl(null)
            loadItems()
            toast.push(
                <Notification type="success">{t('common.deleted', 'Deleted!')}</Notification>,
                { placement: 'top-center' },
            )
        } catch {
            toast.push(
                <Notification type="danger">{t('common.failedToDelete', 'Failed to delete')}</Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const colCount = 2 + (showValue ? 1 : 0) + extraFields.length

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>{title}</h3>
                        <Button variant="solid" icon={<TbPlus />} onClick={openCreate}>
                            {t('catalogs.addNew', 'Add')}
                        </Button>
                    </div>
                    <Table>
                        <THead>
                            <Tr>
                                <Th>{t('catalogs.name', 'Name')}</Th>
                                {showValue && <Th>{t('catalogs.value', 'Value')}</Th>}
                                {extraFields.map((f) => (
                                    <Th key={f.key}>{f.label}</Th>
                                ))}
                                <Th>{t('catalogs.actions', 'Actions')}</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {paginatedItems.length === 0 ? (
                                <Tr>
                                    <Td colSpan={colCount} className="text-center text-gray-400 py-8">
                                        {t('catalogs.noData', 'No items')}
                                    </Td>
                                </Tr>
                            ) : (
                                paginatedItems.map((item) => (
                                    <Tr key={item.id}>
                                        <Td className="font-semibold">{item.displayName || item.name}</Td>
                                        {showValue && <Td>{item.value}</Td>}
                                        {extraFields.map((f) => (
                                            <Td key={f.key}>
                                                {f.render ? f.render(String((item as Record<string, unknown>)[f.key] ?? ''), item) : String((item as Record<string, unknown>)[f.key] ?? '')}
                                            </Td>
                                        ))}
                                        <Td>
                                            <div className="flex items-center gap-2">
                                                <Tooltip title={t('common.edit', 'Edit')}>
                                                    <button className="text-xl cursor-pointer" onClick={() => openEdit(item)}>
                                                        <TbPencil />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title={t('common.delete', 'Delete')}>
                                                    <button
                                                        className="text-xl cursor-pointer text-red-500"
                                                        onClick={() => confirmDelete(item.id)}
                                                    >
                                                        <TbTrash />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </TBody>
                    </Table>
                    <div className="flex items-center justify-between mt-4">
                        <Pagination
                            pageSize={pageSize}
                            currentPage={pageIndex}
                            total={total}
                            onChange={(page) => setPageIndex(page)}
                        />
                        <div style={{ minWidth: 130 }}>
                            <Select
                                size="sm"
                                menuPlacement="top"
                                isSearchable={false}
                                value={pageSizeOption.find((o) => o.value === pageSize)}
                                options={pageSizeOption}
                                onChange={(option) => {
                                    setPageSize(option?.value ?? 10)
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </AdaptiveCard>

            <Dialog
                isOpen={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditingItem(null) }}
                onRequestClose={() => { setDialogOpen(false); setEditingItem(null) }}
            >
                <h5 className="mb-4">
                    {editingItem ? t('catalogs.edit', 'Edit') : t('catalogs.create', 'Create')}
                </h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        <FormItem
                            label={t('catalogs.name', 'Name')}
                            invalid={Boolean(errors.name)}
                            errorMessage={errors.name?.message}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input placeholder={t('catalogs.name', 'Name')} value={String(field.value ?? '')} onChange={field.onChange} onBlur={field.onBlur} />
                                )}
                            />
                        </FormItem>
                        {showValue && (
                            <FormItem
                                label={t('catalogs.value', 'Value')}
                                invalid={Boolean(errors.value)}
                                errorMessage={errors.value?.message}
                            >
                                <Controller
                                    name="value"
                                    control={control}
                                    render={({ field }) => (
                                        <Input placeholder={t('catalogs.value', 'Value')} value={String(field.value ?? '')} onChange={field.onChange} onBlur={field.onBlur} />
                                    )}
                                />
                            </FormItem>
                        )}
                        {formFields.map((f) => {
                            const fieldName = f.key
                            return (
                                <FormItem
                                    key={fieldName}
                                    label={String(f.label)}
                                    invalid={Boolean(errors[fieldName as keyof FormSchema])}
                                    errorMessage={errors[fieldName as keyof FormSchema]?.message}
                                >
                                    <Controller
                                        name={fieldName as keyof FormSchema}
                                        control={control}
                                        render={({ field }) => (
                                            <Input placeholder={String(f.label)} value={String(field.value ?? '')} onChange={field.onChange} onBlur={field.onBlur} />
                                        )}
                                    />
                                </FormItem>
                            )
                        })}
                        {translatable && LOCALES.map((l) => {
                            const fieldName = `translation_${l}` as keyof FormSchema
                            return (
                                <FormItem
                                    key={String(fieldName)}
                                    label={`Name (${l.toUpperCase()})`}
                                    invalid={Boolean(errors[fieldName])}
                                    errorMessage={errors[fieldName]?.message}
                                >
                                    <Controller
                                        name={fieldName}
                                        control={control}
                                        render={({ field }) => (
                                            <Input placeholder={`Name (${l.toUpperCase()})`} value={String(field.value ?? '')} onChange={field.onChange} onBlur={field.onBlur} />
                                        )}
                                    />
                                </FormItem>
                            )
                        })}
                        {imageUpload && editingItem && (
                            <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
                                {previewUrl && (
                                    <img src={previewUrl} alt="flag" className="w-16 h-12 object-contain rounded shadow" />
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        variant="default"
                                        icon={<TbUpload />}
                                        loading={uploading}
                                        onClick={() => document.getElementById('flag-input')?.click()}
                                    >
                                        {t('catalogs.uploadFlag', 'Upload flag')}
                                    </Button>
                                    {previewUrl && (
                                        <Button
                                            variant="default"
                                            icon={<TbTrashOff />}
                                            onClick={handleDeleteFlag}
                                        >
                                            {t('common.delete', 'Delete')}
                                        </Button>
                                    )}
                                    <input
                                        id="flag-input"
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="solid" type="submit" loading={isSubmitting}>
                                {editingItem ? t('common.save', 'Save') : t('common.create', 'Create')}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                type="danger"
                title={t('common.confirmDelete', 'Confirm Delete')}
                confirmText={t('common.delete', 'Delete')}
                cancelText={t('common.cancel', 'Cancel')}
                confirmButtonProps={{ className: 'bg-red-500 hover:bg-red-600' }}
                onCancel={() => { setDeleteDialogOpen(false); setDeletingId(null) }}
                onConfirm={handleDelete}
            >
                <p>{t('catalogs.deleteConfirm', 'Are you sure you want to delete this item?')}</p>
            </ConfirmDialog>
        </Container>
    )
}

export default CatalogManager
