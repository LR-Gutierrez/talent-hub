import CatalogManager from '@/components/shared/CatalogManager'
import useTranslation from '@/utils/hooks/useTranslation'

const UniformSizesCatalog = () => {
    const { t } = useTranslation()
    return (
        <CatalogManager
            title={t('catalogs.uniformSizes', 'Uniform Sizes')}
            endpoint="/uniform-sizes"
            showValue
            extraFields={[{ key: 'category', label: t('catalogs.category', 'Category') }]}
        />
    )
}

export default UniformSizesCatalog
