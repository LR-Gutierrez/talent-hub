import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TbChevronDown } from 'react-icons/tb'
import classNames from 'classnames'
import type { ReactNode } from 'react'

type CollapsibleSectionProps = {
    title: string
    children: ReactNode
    icon?: ReactNode
    defaultOpen?: boolean
}

const CollapsibleSection = ({ title, children, icon, defaultOpen = true }: CollapsibleSectionProps) => {
    const [open, setOpen] = useState(defaultOpen)
    const [animating, setAnimating] = useState(false)

    const handleAnimationStart = useCallback(() => setAnimating(true), [])
    const handleAnimationComplete = useCallback(() => setAnimating(false), [])

    return (
        <div
            className={classNames(
                'bg-white dark:bg-gray-800 border rounded-lg transition-shadow duration-200',
                open
                    ? 'border-gray-200 dark:border-gray-700 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700',
            )}
        >
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={classNames(
                    'w-full flex items-center justify-between px-4 py-3 transition-colors duration-150',
                    open
                        ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg',
                )}
            >
                <div className="flex items-center gap-2.5">
                    {icon && (
                        <span
                            className={classNames(
                                'text-lg transition-colors duration-200',
                                open ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500',
                            )}
                        >
                            {icon}
                        </span>
                    )}
                    <h4 className="text-base font-semibold m-0">{title}</h4>
                </div>
                <TbChevronDown
                    className={classNames(
                        'text-lg transition-all duration-200',
                        open
                            ? 'rotate-180 text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500',
                    )}
                />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className={animating ? 'overflow-hidden' : ''}
                        onAnimationStart={handleAnimationStart}
                        onAnimationComplete={handleAnimationComplete}
                    >
                        <div className="p-4">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CollapsibleSection
