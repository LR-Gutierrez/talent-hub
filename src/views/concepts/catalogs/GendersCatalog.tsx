import CatalogManager from '@/components/shared/CatalogManager'
import useTranslation from '@/utils/hooks/useTranslation'

const GendersCatalog = () => {
    const { t } = useTranslation()
    return (
        <CatalogManager
            title={t('catalogs.genders', 'Genders')}
            endpoint="/genders"
            translatable
        />
    )
}

export default GendersCatalog
