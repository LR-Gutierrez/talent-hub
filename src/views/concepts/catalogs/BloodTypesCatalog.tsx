import CatalogManager from '@/components/shared/CatalogManager'
import useTranslation from '@/utils/hooks/useTranslation'

const BloodTypesCatalog = () => {
    const { t } = useTranslation()
    return (
        <CatalogManager
            title={t('catalogs.bloodTypes', 'Blood Types')}
            endpoint="/blood-types"
            translatable
        />
    )
}

export default BloodTypesCatalog
