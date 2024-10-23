import { FC } from 'react'
import { currencyToCountry } from './CurrencyToCountry'

interface CurrencyFlagProps {
  countryCode: string
  className?: string
}

export const CurrencyFlag: FC<CurrencyFlagProps> = (props) => {
  const { countryCode, className = '' } = props
  const code = currencyToCountry[countryCode]

  console.log(`countryCode: ${countryCode}`)
  console.log(`code: ${code}`)

  return (
    <img
      src={`/flags/${code}.svg`}
      alt={`${countryCode} flag`}
      className={`w-6 h-4 object-cover ${className}`}
    />
  )
}