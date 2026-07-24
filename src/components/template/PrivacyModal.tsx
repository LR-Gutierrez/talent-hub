import { useState } from 'react'
import { Dialog, Button } from '@/components/ui'
import { APP_NAME } from '@/constants/app.constant'
import useTranslation from '@/utils/hooks/useTranslation'

const PrivacyModal = () => {
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
                {t('footer.privacy', 'Políticas de Privacidad')}
            </a>
            <Dialog
                isOpen={isOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                width={700}
            >
                <div className="flex flex-col h-full justify-between">
                    <h4 className="mb-4">Políticas de Privacidad</h4>
                    <div className="overflow-y-auto max-h-[60vh] pr-4 text-sm text-gray-700 dark:text-gray-300 space-y-4">
                        <p>
                            <strong>Última actualización:</strong> {new Date().toLocaleDateString()}
                        </p>
                        
                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">1. Información Recopilada</h6>
                        <p>
                            Como plataforma de Gestión de Recursos Humanos ({APP_NAME}), recopilamos datos estrictamente necesarios para la gestión del talento, evaluación de desempeño y administración interna de {import.meta.env.VITE_COMPANY_NAME || 'la empresa'}. Esto incluye, pero no se limita a: nombres completos, documentos de identidad, información de contacto, historiales laborales, salarios, evaluaciones y currículums (CVs).
                        </p>

                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">2. Uso de la Información</h6>
                        <p>
                            La información almacenada en este sistema se utiliza exclusivamente con fines operativos internos de recursos humanos. Los datos no son vendidos, alquilados ni compartidos con terceros con fines comerciales o de marketing.
                        </p>

                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">3. Protección y Seguridad</h6>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas para proteger los datos contra accesos no autorizados, pérdida, destrucción o alteración. Todos los datos sensibles viajan cifrados y el acceso a la plataforma está restringido mediante protocolos de autenticación seguros.
                        </p>

                        <h6 className="text-gray-900 dark:text-white mt-6 mb-2">4. Derechos del Usuario (ARCO)</h6>
                        <p>
                            Cualquier empleado o candidato registrado tiene derecho a solicitar el acceso, rectificación, cancelación u oposición al tratamiento de sus datos personales. Estas solicitudes deben canalizarse directamente a través del departamento de Recursos Humanos o Administración.
                        </p>
                    </div>
                    <div className="text-right mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
                        <Button variant="solid" onClick={onDialogClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default PrivacyModal
