import { useState } from 'react'
import { Dialog, Button } from '@/components/ui'
import { APP_NAME } from '@/constants/app.constant'
import useTranslation from '@/utils/hooks/useTranslation'

const TermsModal = () => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const onDialogClose = () => setIsOpen(false)
    const onDialogOpen = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsOpen(true)
    }

    return (
        <>
            <a
                className="text-gray hover:text-primary transition-colors cursor-pointer"
                onClick={onDialogOpen}
            >
                {t('footer.terms', 'Términos y Condiciones')}
            </a>
            <Dialog
                isOpen={isOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                width={700}
            >
                <div className="flex flex-col h-full justify-between">
                    <h4 className="mb-4">Términos y Condiciones de Uso</h4>
                    <div className="overflow-y-auto max-h-[60vh] pr-4 text-sm text-gray-700 dark:text-gray-300 space-y-4">
                        <p>
                            <strong>Última actualización:</strong> {new Date().toLocaleDateString()}
                        </p>

                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">1. Uso del Sistema</h6>
                        <p>
                            El acceso a {APP_NAME} está estrictamente reservado para el personal autorizado de {import.meta.env.VITE_COMPANY_NAME || 'la empresa'}. Las credenciales de acceso son personales, intransferibles y deben mantenerse bajo estricta confidencialidad. Cualquier uso no autorizado o compartición de credenciales resultará en la suspensión inmediata del acceso.
                        </p>

                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">2. Manejo de Información Confidencial</h6>
                        <p>
                            Toda la información contenida en este sistema (incluyendo datos de empleados, candidatos, evaluaciones y salarios) es de carácter altamente confidencial. Al usar este sistema, usted acepta que no extraerá, copiará, distribuirá ni utilizará esta información para ningún propósito externo a sus funciones estrictamente laborales.
                        </p>

                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">3. Uso Aceptable y Prohibiciones</h6>
                        <p>
                            Está terminantemente prohibido utilizar el sistema para propósitos discriminatorios, almacenar material malicioso o ilegal, o intentar vulnerar la seguridad de la plataforma. La subida de documentos (como CVs) debe hacerse asegurándose previamente de que los archivos estén libres de software malicioso.
                        </p>

                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">4. Monitoreo y Auditoría</h6>
                        <p>
                            Por motivos de seguridad y cumplimiento legal, la actividad dentro del sistema, incluyendo los inicios de sesión, las modificaciones de registros y las consultas, puede ser monitoreada y auditada por los administradores del sistema.
                        </p>

                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">5. Limitación de Responsabilidad</h6>
                        <p>
                            El sistema se proporciona "tal cual". Aunque se realizan respaldos continuos y se aplican medidas de seguridad, los desarrolladores y mantenedores de la plataforma no se hacen responsables por caídas imprevistas del servicio, pérdida fortuita de información o vulneraciones producto del mal manejo de contraseñas por parte de los usuarios.
                        </p>
                    </div>
                    <div className="text-right mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
                        <Button variant="solid" onClick={onDialogClose}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default TermsModal
