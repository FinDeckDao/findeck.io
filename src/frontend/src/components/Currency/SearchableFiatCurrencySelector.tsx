import { useState, useEffect, type FC } from 'react'
import CurrencyList from 'currency-list'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

export interface FiatCurrency {
  name: string
  symbol_native: string
  symbol: string
  code: string
  name_plural: string
  rounding: number
  decimal_digits: number
}

interface CurrencySelectorProps {
  onSelect: (currency: FiatCurrency) => void
  locale?: string
}

export const SearchableFiatCurrencySelector: FC<CurrencySelectorProps> = ({ onSelect, locale = 'en_US' }) => {
  const [currencies, setCurrencies] = useState<FiatCurrency[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const currencyList = CurrencyList.getAll(locale)
    setCurrencies(Object.values(currencyList))
  }, [locale])

  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Command className="rounded-lg border bg-dark text-white">
      <div className="flex items-center border-b border-gray-800 px-3">
        <CommandInput
          placeholder="Search currencies..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="border-0 bg-dark text-white placeholder:text-gray-400 focus:ring-0"
        />
      </div>
      <CommandList className="bg-dark">
        <CommandEmpty className="text-gray-400">No currencies found.</CommandEmpty>
        <CommandGroup>
          {filteredCurrencies.map((currency) => (
            <CommandItem
              key={currency.code}
              onSelect={() => onSelect(currency)}
              className="flex items-center gap-2 p-2 cursor-pointer text-white"
            >
              <span className="font-medium">{currency.code}</span>
              <span className="text-lg">{currency.symbol_native}</span>
              <span className="text-sm text-gray-400">{currency.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}