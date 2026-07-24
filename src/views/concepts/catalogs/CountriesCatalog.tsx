import CatalogManager from '@/components/shared/CatalogManager'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbFlag } from 'react-icons/tb'

const flagUrl = (code: string) => `/uploads/flags/${code}.png`

const CountriesCatalog = () => {
    const { t } = useTranslation()
    return (
        <CatalogManager
            title={t('catalogs.countries', 'Countries')}
            endpoint="/countries"
            showValue
            extraFields={[
                {
                    key: 'flag',
                    label: <TbFlag className="text-lg" />,
                    showInForm: false,
                    render: (_value: string, item: any) => (
                        <img
                            src={flagUrl(item.value)}
                            alt={item.name}
                            className="inline-block w-6 h-[18px] rounded-sm shadow-sm object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                    ),
                },
                { key: 'dialCode', label: t('catalogs.dialCode', 'Dial Code') },
            ]}
            imageUpload={{
                endpoint: '/countries',
                getImageUrl: (item) => flagUrl(item.value!),
            }}
        />
    )
}

export default CountriesCatalog
