import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import { apiGetEmployeeHistory } from '@/services/EmployeesService'
import useTranslation from '@/utils/hooks/useTranslation'
import type { EmployeeHistory } from '../EmployeeList/types'

type Props = {
    employeeId: string
}

const fieldLabels: Record<string, string> = {
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    department: 'Department',
    position: 'Position',
    salary: 'Salary',
    status: 'Status',
}

const EmployeeHistoryTimeline = ({ employeeId }: Props) => {
    const { t } = useTranslation()
    const [history, setHistory] = useState<EmployeeHistory[]>([])

    useEffect(() => {
        apiGetEmployeeHistory<EmployeeHistory[]>(employeeId).then(setHistory)
    }, [employeeId])

    if (history.length === 0) return null

    return (
        <Card>
            <h4 className="mb-6">{t('employeeDetails.history', 'Change History')}</h4>
            <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                {history.map((entry) => (
                    <div key={entry.id} className="relative flex gap-4 pb-6">
                        <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-white dark:border-gray-900 z-10" />
                        <div className="ml-10 flex-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(entry.changedAt).toLocaleString()}
                            </div>
                            <div className="font-semibold mt-1">
                                {fieldLabels[entry.changedField] || entry.changedField}
                            </div>
                            <div className="text-sm mt-1">
                                {entry.oldValue && (
                                    <span className="line-through text-red-500 mr-2">{entry.oldValue}</span>
                                )}
                                {entry.newValue && (
                                    <span className="text-emerald-500 font-medium">{entry.newValue}</span>
                                )}
                            </div>
                            {entry.changedBy && (
                                <div className="text-xs text-gray-400 mt-1">
                                    {t('employeeDetails.changedBy', 'Changed by')}: {entry.changedBy}
                                </div>
                            )}
                            {entry.notes && (
                                <div className="text-xs text-gray-500 italic mt-1">{entry.notes}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default EmployeeHistoryTimeline
