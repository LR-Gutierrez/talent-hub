import useTranslation from '@/utils/hooks/useTranslation'

const Home = () => {
    const { t } = useTranslation()

    return <div>{t('common.home', 'Home')}</div>
}

export default Home
