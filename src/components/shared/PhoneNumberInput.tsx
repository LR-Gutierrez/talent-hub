import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import classNames from 'classnames'
import type { ComponentProps } from 'react'

type PhoneNumberInputProps = ComponentProps<typeof PhoneInput> & {
    wrapperClassName?: string
}

const PhoneNumberInput = ({ wrapperClassName, ...props }: PhoneNumberInputProps) => {
    return (
        <PhoneInput
            {...props}
            className={classNames('phone-number-input-wrapper', wrapperClassName)}
        />
    )
}

export default PhoneNumberInput
