import CatalogManager from '@/components/shared/CatalogManager'
import useTranslation from '@/utils/hooks/useTranslation'

const EducationLevelsCatalog = () => {
    const { t } = useTranslation()
    return (
        <CatalogManager
            title={t('catalogs.educationLevels', 'Education Levels')}
            endpoint="/education-levels"
            translatable
        />
    )
}

export default EducationLevelsCatalog
