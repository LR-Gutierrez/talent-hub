import CatalogManager from '@/components/shared/CatalogManager'
import useTranslation from '@/utils/hooks/useTranslation'

const MaritalStatusesCatalog = () => {
    const { t } = useTranslation()
    return (
        <CatalogManager
            title={t('catalogs.maritalStatuses', 'Marital Statuses')}
            endpoint="/marital-statuses"
            translatable
        />
    )
}

export default MaritalStatusesCatalog
