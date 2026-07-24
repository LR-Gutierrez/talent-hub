import CatalogManager from '@/components/shared/CatalogManager'
import useTranslation from '@/utils/hooks/useTranslation'

const EmployeeDegreesCatalog = () => {
    const { t } = useTranslation()
    return (
        <CatalogManager
            title={t('catalogs.employeeDegrees', 'Degrees / Titles')}
            endpoint="/employee-degrees"
            showValue
        />
    )
}

export default EmployeeDegreesCatalog
