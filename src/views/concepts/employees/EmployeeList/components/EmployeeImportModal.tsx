import { useState, useRef } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    TbUpload,
    TbDownload,
    TbFileSpreadsheet,
    TbCheck,
    TbX,
    TbArrowLeft,
    TbAlertTriangle,
    TbTableFilled,
    TbColumns3,
    TbUserFilled,
    TbDatabase,
    TbChevronDown,
    TbChevronUp,
    TbPlus,
    TbBan,
} from 'react-icons/tb'
import {
    apiPreviewEmployeesExcel,
    apiImportEmployeesExcel,
    apiDownloadImportTemplate,
    type PreviewResult,
    type ImportResult,
} from '@/services/EmployeesService'
import useTranslation from '@/utils/hooks/useTranslation'

type EmployeeImportModalProps = {
    isOpen: boolean
    onClose: () => void
    onImportComplete: () => void
}

type ModalState = 'idle' | 'previewing' | 'preview' | 'importing' | 'results'

const StatCard = ({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode
    label: string
    value: string | number
    color: string
}) => (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
)

const MissingCatalogItem = ({
    name,
    affectedRows,
    checked,
    onToggle,
    typeLabel,
}: {
    name: string
    affectedRows: number
    checked: boolean
    onToggle: () => void
    typeLabel: string
}) => (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-yellow-200 dark:border-yellow-800 last:border-b-0">
        <div className="flex items-center gap-2 min-w-0">
            {checked ? (
                <TbPlus className="text-xs text-green-500 shrink-0" />
            ) : (
                <TbBan className="text-xs text-gray-400 shrink-0" />
            )}
            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {affectedRows} {typeLabel}
                </p>
            </div>
        </div>
        <Switcher
            checked={checked}
            onChange={onToggle}
            checkedContent={<TbPlus className="text-xs" />}
            unCheckedContent={<TbX className="text-xs" />}
        />
    </div>
)

const EmployeeImportModal = ({ isOpen, onClose, onImportComplete }: EmployeeImportModalProps) => {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [modalState, setModalState] = useState<ModalState>('idle')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<PreviewResult | null>(null)
    const [result, setResult] = useState<ImportResult | null>(null)
    const [warningsExpanded, setWarningsExpanded] = useState(false)
    const [autoCreateDepts, setAutoCreateDepts] = useState<Set<string>>(new Set())
    const [autoCreateBloods, setAutoCreateBloods] = useState<Set<string>>(new Set())

    const handleClose = () => {
        setModalState('idle')
        setSelectedFile(null)
        setPreview(null)
        setResult(null)
        setWarningsExpanded(false)
        setAutoCreateDepts(new Set())
        setAutoCreateBloods(new Set())
        onClose()
    }

    const handleGoBack = () => {
        setModalState('idle')
        setPreview(null)
        setWarningsExpanded(false)
        setAutoCreateDepts(new Set())
        setAutoCreateBloods(new Set())
    }

    const handleDownloadTemplate = async () => {
        try {
            const blob = await apiDownloadImportTemplate()
            const url = window.URL.createObjectURL(blob as unknown as Blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'employees_import_template.xlsx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch {
            toast.push(
                <Notification type="danger">
                    {t('import.failedToDownloadTemplate', 'Failed to download template')}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handlePreview = async () => {
        if (!selectedFile) return
        setModalState('previewing')
        try {
            const res = await apiPreviewEmployeesExcel(selectedFile)
            setPreview(res)
            setAutoCreateDepts(new Set(res.missingCatalogs.departments.map((d) => d.name)))
            setAutoCreateBloods(new Set(res.missingCatalogs.bloodTypes.map((b) => b.name)))
            setModalState('preview')
        } catch {
            toast.push(
                <Notification type="danger">
                    {t('import.failedToPreview', 'Failed to analyze file')}
                </Notification>,
                { placement: 'top-center' },
            )
            setModalState('idle')
        }
    }

    const handleConfirmImport = async () => {
        if (!selectedFile) return
        setModalState('importing')
        try {
            const res = await apiImportEmployeesExcel(
                selectedFile,
                [...autoCreateDepts],
                [...autoCreateBloods],
            )
            setResult(res)
            setModalState('results')
            onImportComplete()
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string | string[]; error?: { response?: { data?: { message?: string | string[] } } } } } }
            const responseData = axiosErr?.response?.data
            let errorMsg = t('import.failedToImport', 'Failed to import employees')
            let errorRows: { row: number; message: string }[] = []

            const msg = responseData?.message
            if (Array.isArray(msg)) {
                try {
                    errorRows = JSON.parse(msg[0])
                } catch {
                    errorMsg = msg.join(', ')
                }
            } else if (typeof msg === 'string') {
                try {
                    errorRows = JSON.parse(msg)
                } catch {
                    errorMsg = msg
                }
            }

            if (errorRows.length > 0) {
                setResult({ imported: 0, errors: errorRows })
                setModalState('results')
            } else {
                toast.push(
                    <Notification type="danger">{errorMsg}</Notification>,
                    { placement: 'top-center' },
                )
                setModalState('idle')
            }
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const toggleDept = (name: string) => {
        setAutoCreateDepts((prev) => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    const toggleBlood = (name: string) => {
        setAutoCreateBloods((prev) => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    const mappedCount = preview?.mappedColumns.length ?? 0
    const unmappedCount = preview?.unmappedColumns.length ?? 0
    const warningCount = preview?.warnings.length ?? 0
    const duplicateCount = preview?.duplicateNames.length ?? 0
    const missingDeptCount = preview?.missingCatalogs.departments.length ?? 0
    const missingBloodCount = preview?.missingCatalogs.bloodTypes.length ?? 0
    const totalMissing = missingDeptCount + missingBloodCount

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={640}>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t('import.title', 'Import Employees from Excel')}
                </h4>

                {/* ─── STEP 1: IDLE (file selection) ─── */}
                {modalState === 'idle' && (
                    <div className="flex flex-col gap-4">
                        <button
                            type="button"
                            className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 transition hover:border-primary hover:bg-primary/5 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <TbFileSpreadsheet className="text-4xl text-gray-400" />
                            <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedFile
                                        ? selectedFile.name
                                        : t('import.dragOrClick', 'Drag and drop an Excel file or click to browse')}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">.xlsx, .xls</p>
                            </div>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="plain"
                                icon={<TbDownload />}
                                onClick={handleDownloadTemplate}
                                className="flex-1"
                            >
                                {t('import.downloadTemplate', 'Download Template')}
                            </Button>
                            <Button
                                variant="solid"
                                icon={<TbUpload />}
                                onClick={handlePreview}
                                disabled={!selectedFile}
                                className="flex-1"
                            >
                                {t('import.analyzeFile', 'Analyze File')}
                            </Button>
                        </div>
                    </div>
                )}

                {/* ─── STEP 2a: PREVIEWING (loading) ─── */}
                {modalState === 'previewing' && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('import.analyzing', 'Analyzing file structure...')}
                        </p>
                    </div>
                )}

                {/* ─── STEP 2b: PREVIEW (confirmation) ─── */}
                {modalState === 'preview' && preview && (
                    <div className="flex flex-col gap-4">
                        {/* Stat cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <StatCard
                                icon={<TbTableFilled className="text-base" />}
                                label={t('import.totalRows', 'Total Rows')}
                                value={preview.totalRows}
                                color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            />
                            <StatCard
                                icon={<TbColumns3 className="text-base" />}
                                label={t('import.mappedColumns', 'Mapped Columns')}
                                value={mappedCount}
                                color="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            />
                            <StatCard
                                icon={<TbUserFilled className="text-base" />}
                                label={t('import.existingDuplicates', 'Duplicates Found')}
                                value={duplicateCount}
                                color="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            />
                            <StatCard
                                icon={<TbDatabase className="text-base" />}
                                label={t('import.unmappedColumns', 'Unmapped Columns')}
                                value={unmappedCount}
                                color={unmappedCount > 0 ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}
                            />
                        </div>

                        {/* Missing catalogs — actionable */}
                        {totalMissing > 0 && (
                            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <TbAlertTriangle className="text-xs text-yellow-600 dark:text-yellow-400" />
                                    <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                                        {t('import.missingCatalogsTitle', { count: totalMissing })}
                                    </p>
                                </div>

                                {missingDeptCount > 0 && (
                                    <div className="mb-2">
                                        <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                                            {t('import.departments', 'Departments')}
                                        </p>
                                        {preview.missingCatalogs.departments.map((d) => (
                                            <MissingCatalogItem
                                                key={d.name}
                                                name={d.name}
                                                affectedRows={d.affectedRows}
                                                checked={autoCreateDepts.has(d.name)}
                                                onToggle={() => toggleDept(d.name)}
                                                typeLabel={t('import.affectedRows', 'affected row(s)')}
                                            />
                                        ))}
                                    </div>
                                )}

                                {missingBloodCount > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                                            {t('import.bloodTypes', 'Blood Types')}
                                        </p>
                                        {preview.missingCatalogs.bloodTypes.map((b) => (
                                            <MissingCatalogItem
                                                key={b.name}
                                                name={b.name}
                                                affectedRows={b.affectedRows}
                                                checked={autoCreateBloods.has(b.name)}
                                                onToggle={() => toggleBlood(b.name)}
                                                typeLabel={t('import.affectedRows', 'affected row(s)')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Unmapped columns */}
                        {unmappedCount > 0 && (
                            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3">
                                <p className="text-xs font-medium text-orange-700 dark:text-orange-300 mb-1">
                                    {t('import.unmappedTitle', 'Unmapped columns (will be ignored):')}
                                </p>
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                    {preview.unmappedColumns.join(', ')}
                                </p>
                            </div>
                        )}

                        {/* Other warnings (non-catalog) */}
                        {warningCount > 0 && (
                            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <TbAlertTriangle className="text-xs text-yellow-600 dark:text-yellow-400" />
                                    <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                                        {t('import.warningsTitle', { count: warningCount })}
                                    </p>
                                </div>
                                <div className={warningsExpanded ? '' : 'max-h-20 overflow-hidden'}>
                                    {(warningsExpanded ? preview.warnings : preview.warnings.slice(0, 3)).map((w, i) => (
                                        <p key={i} className="text-xs text-yellow-600 dark:text-yellow-400 leading-relaxed">
                                            {w}
                                        </p>
                                    ))}
                                </div>
                                {warningCount > 3 && (
                                    <button
                                        type="button"
                                        className="mt-1 flex items-center gap-1 text-xs font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors cursor-pointer"
                                        onClick={() => setWarningsExpanded(!warningsExpanded)}
                                    >
                                        {warningsExpanded ? (
                                            <>
                                                <TbChevronUp className="text-xs" />
                                                {t('import.showLess', 'Show less')}
                                            </>
                                        ) : (
                                            <>
                                                <TbChevronDown className="text-xs" />
                                                {t('import.showAll', { count: warningCount }) || `Show all ${warningCount} warnings`}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Duplicates warning */}
                        {duplicateCount > 0 && (
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3">
                                <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                                    {t('import.duplicatesTitle', 'Employees that already exist (will be skipped or updated):')}
                                </p>
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                    {preview.duplicateNames.slice(0, 5).join(', ')}
                                    {duplicateCount > 5 && ` ... +${duplicateCount - 5}`}
                                </p>
                            </div>
                        )}

                        {/* Sample data */}
                        {preview.sampleData.length > 0 && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    {t('import.sampleData', 'Sample Data (first rows):')}
                                </p>
                                <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-800">
                                                {preview.mappedColumns.slice(0, 6).map((mc) => (
                                                    <th key={mc.mappedTo} className="px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                        {mc.excelHeader}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.sampleData.map((row, idx) => (
                                                <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                                    {preview.mappedColumns.slice(0, 6).map((mc) => (
                                                        <td key={mc.mappedTo} className="px-2 py-1.5 text-gray-700 dark:text-gray-300 whitespace-nowrap max-w-[120px] truncate">
                                                            {row[mc.excelHeader] || '—'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="plain"
                                icon={<TbArrowLeft />}
                                onClick={handleGoBack}
                                className="flex-1"
                            >
                                {t('common.back', 'Back')}
                            </Button>
                            <Button
                                variant="solid"
                                icon={<TbUpload />}
                                onClick={handleConfirmImport}
                                className="flex-1"
                            >
                                {t('import.confirmImport', 'Confirm Import')}
                            </Button>
                        </div>
                    </div>
                )}

                {/* ─── STEP 3: IMPORTING (loading) ─── */}
                {modalState === 'importing' && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('import.importing', 'Importing employees...')}
                        </p>
                    </div>
                )}

                {/* ─── STEP 4: RESULTS ─── */}
                {modalState === 'results' && result && (
                    <div className="flex flex-col gap-4">
                        {result.imported > 0 ? (
                            <div className="flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                                <TbCheck className="text-xl text-green-500" />
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    {t('import.successMessage', { count: result.imported })}
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                                <TbX className="text-xl text-red-500" />
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    {t('import.rollbackMessage', 'Import cancelled — all changes were rolled back due to errors')}
                                </p>
                            </div>
                        )}

                        {result.errors.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                                    <TbX className="text-xl text-red-500" />
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {t('import.errorsMessage', { count: result.errors.length })}
                                    </p>
                                </div>
                                <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-800">
                                                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                                                    {t('import.row', 'Row')}
                                                </th>
                                                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                                                    {t('import.error', 'Error')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.errors.map((err, idx) => (
                                                <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                                    <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{err.row}</td>
                                                    <td className="px-3 py-2 text-red-600 dark:text-red-400">{err.message}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <Button variant="solid" onClick={handleClose} className="w-full">
                            {t('common.close', 'Close')}
                        </Button>
                    </div>
                )}
            </div>
        </Dialog>
    )
}

export default EmployeeImportModal
