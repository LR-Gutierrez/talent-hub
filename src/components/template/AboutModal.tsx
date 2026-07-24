import { useState } from 'react'
import { Dialog, Button } from '@/components/ui'
import { APP_NAME } from '@/constants/app.constant'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { FaLinkedin, FaGithub, FaMapMarkerAlt } from 'react-icons/fa'
import useTranslation from '@/utils/hooks/useTranslation'

const AboutModal = () => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const onDialogOpen = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsOpen(true)
    }

    return (
        <>
            <a
                className="text-gray cursor-pointer flex items-center gap-1 hover:text-primary transition-colors"
                onClick={onDialogOpen}
            >
                <HiOutlineInformationCircle />
                Acerca del sistema
            </a>
            <Dialog
                isOpen={isOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <h5 className="mb-4">Acerca de {APP_NAME}</h5>
                        <div className="mt-4 mb-6">
                            <p className="mb-3 text-sm">
                                Este sistema y su código fuente son propiedad exclusiva de <strong>{import.meta.env.VITE_COMPANY_NAME || 'la empresa titular'}</strong>.
                            </p>
                            
                            <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                <p className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                    Diseño y Desarrollo
                                </p>
                                
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                            Luis Angel Gutiérrez
                                        </p>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Ingeniero en Informática &bull; Desarrollador de Software
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                                            <FaMapMarkerAlt /> Caracas, Venezuela
                                        </p>
                                    </div>
                                    
                                    <div className="flex gap-3 text-xl text-gray-600 dark:text-gray-400">
                                        <a 
                                            href="https://www.linkedin.com/in/lrgutierrez/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hover:text-[#0a66c2] transition-colors"
                                            title="LinkedIn"
                                        >
                                            <FaLinkedin />
                                        </a>
                                        <a 
                                            href="https://github.com/LR-Gutierrez" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hover:text-gray-900 dark:hover:text-white transition-colors"
                                            title="GitHub"
                                        >
                                            <FaGithub />
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                        Stack & Habilidades
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['React', 'NestJS', 'TypeScript', 'Angular', 'C# / .NET', 'Laravel', 'Kotlin'].map(skill => (
                                            <span 
                                                key={skill} 
                                                className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right mt-6">
                        <Button variant="solid" onClick={onDialogClose}>
                            Entendido
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default AboutModal
