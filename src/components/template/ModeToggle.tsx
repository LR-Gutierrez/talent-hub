import { useCallback } from 'react'
import useDarkMode from '@/utils/hooks/useDarkMode'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { PiSunDuotone, PiMoonDuotone } from 'react-icons/pi'
import type { CommonProps } from '@/@types/common'

const _ModeToggle = ({ className }: CommonProps) => {
    const [isDark, setIsDark] = useDarkMode()

    const toggleMode = useCallback(() => {
        setIsDark(isDark ? 'light' : 'dark')
    }, [isDark, setIsDark])

    return (
        <div
            className={`text-2xl cursor-pointer ${className}`}
            onClick={toggleMode}
            role="button"
        >
            {isDark ? <PiSunDuotone /> : <PiMoonDuotone />}
        </div>
    )
}

const ModeToggle = withHeaderItem(_ModeToggle)

export default ModeToggle
