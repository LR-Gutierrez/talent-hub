import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Chart from '@/components/shared/Chart'
import { apiGetDashboardStats } from '@/services/EmployeesService'
import useTranslation from '@/utils/hooks/useTranslation'
import type { DashboardStats } from '@/services/EmployeesService'
import type { ReactNode, KeyboardEvent } from 'react'
import { TbUsers, TbBuilding, TbTags, TbGenderMale, TbChevronRight } from 'react-icons/tb'

type StatCardProps = {
    title: string
    value: number
    icon: ReactNode
    color: string
    to: string
}

const StatCard = ({ title, value, icon, color, to }: StatCardProps) => {
    const navigate = useNavigate()

    const handleClick = useCallback(() => navigate(to), [navigate, to])
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate(to)
            }
        },
        [navigate, to],
    )

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
            <div className={`flex h-14 w-14 items-center justify-center rounded-lg text-2xl ${color}`}>
                {icon}
            </div>
            <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
            </div>
        </div>
    )
}

const Home = () => {
    const { t } = useTranslation()
    const [stats, setStats] = useState<DashboardStats | null>(null)

    useEffect(() => {
        apiGetDashboardStats().then(setStats)
    }, [])

    const statusDonutSeries = stats?.employeesByStatus.map((s) => s.count) ?? []
    const statusDonutLabels = stats?.employeesByStatus.map((s) => s.statusName) ?? []
    const statusDonutColors = stats?.employeesByStatus.map((s) => s.color || '#6b7280') ?? []

    const deptBarCategories = stats?.employeesByDepartment.map((d) => d.departmentName) ?? []
    const deptBarSeries = stats?.employeesByDepartment.map((d) => d.count) ?? []

    return (
        <Container className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t('dashboard.totalEmployees', 'Total Employees')}
                    value={stats?.totalEmployees ?? 0}
                    icon={<TbUsers />}
                    color="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                    to="/employees"
                />
                <StatCard
                    title={t('dashboard.activeDepartments', 'Active Departments')}
                    value={stats?.totalDepartments ?? 0}
                    icon={<TbBuilding />}
                    color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    to="/departments"
                />
                <StatCard
                    title={t('dashboard.statusTypes', 'Status Types')}
                    value={stats?.totalStatuses ?? 0}
                    icon={<TbTags />}
                    color="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                    to="/employee-statuses"
                />
                <StatCard
                    title={t('dashboard.genders', 'Genders')}
                    value={stats?.totalGenders ?? 0}
                    icon={<TbGenderMale />}
                    color="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                    to="/catalogs/genders"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AdaptiveCard className="p-5">
                    <h5 className="mb-4">{t('dashboard.employeesByStatus', 'Employees by Status')}</h5>
                    <Chart
                        type="donut"
                        series={statusDonutSeries}
                        customOptions={{
                            labels: statusDonutLabels,
                            colors: statusDonutColors,
                            chart: { type: 'donut' },
                        }}
                        height={280}
                    />
                </AdaptiveCard>
                <AdaptiveCard className="p-5">
                    <h5 className="mb-4">{t('dashboard.employeesByDepartment', 'Employees by Department')}</h5>
                    <Chart
                        type="bar"
                        series={[{ name: t('common.employees', 'Employees'), data: deptBarSeries }]}
                        xAxis={deptBarCategories}
                        customOptions={{
                            colors: ['#3b82f6'],
                            plotOptions: {
                                bar: {
                                    horizontal: true,
                                    columnWidth: '35px',
                                    borderRadius: 4,
                                    borderRadiusApplication: 'end',
                                },
                            },
                        }}
                        height={280}
                    />
                </AdaptiveCard>
            </div>

            <AdaptiveCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h5>{t('dashboard.recentEmployees', 'Recent Employees')}</h5>
                    <Link
                        to="/employees"
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                        {t('common.viewAll', 'View all')}
                        <TbChevronRight />
                    </Link>
                </div>
                {stats && stats.recentEmployees.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                                    <th className="pb-3 font-medium">{t('employeeList.fullName', 'Full Name')}</th>
                                    <th className="pb-3 font-medium">{t('employeeList.department', 'Department')}</th>
                                    <th className="pb-3 font-medium">{t('employeeList.status', 'Status')}</th>
                                    <th className="pb-3 font-medium">{t('common.createdAt', 'Created')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentEmployees.map((emp) => (
                                    <tr key={emp.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <td className="py-3">
                                            <Link
                                                to={`/employees/${emp.id}`}
                                                className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary"
                                            >
                                                {emp.fullName}
                                            </Link>
                                            <div className="text-xs text-gray-400">{emp.position || emp.email}</div>
                                        </td>
                                        <td className="py-3 text-gray-600 dark:text-gray-300">
                                            {emp.department?.name || '-'}
                                        </td>
                                        <td className="py-3">
                                            {emp.status && (
                                                <span
                                                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                                                    style={{
                                                        backgroundColor: emp.status.color ? emp.status.color + '30' : '#f3f4f6',
                                                        color: emp.status.color || '#374151',
                                                        borderColor: emp.status.color || 'transparent',
                                                    }}
                                                >
                                                    {emp.status.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-gray-500">
                                            {new Date(emp.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-400">
                        {t('dashboard.noRecentEmployees', 'No employees yet.')}
                    </div>
                )}
            </AdaptiveCard>
        </Container>
    )
}

export default Home
