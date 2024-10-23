import { useState, forwardRef } from 'react'
import { SearchableCurrencyList, SearchableCurrencyListRef } from '@/Components/Currency/SearchableCurrencyList'
import { SearchableFiatCurrencySelector } from '@/Components/Currency/SearchableFiatCurrencySelector'
import { Asset } from '../../../../declarations/trade_manager/trade_manager.did'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { FiatCurrency } from '@/Components/Currency/SearchableFiatCurrencySelector'

interface QuoteAssetSelectorProps {
  onSelect: (asset: Asset | null) => void
}

export const QuoteAssetSelector = forwardRef<SearchableCurrencyListRef, QuoteAssetSelectorProps>((props, ref) => {
  const { onSelect } = props
  const [quoteAssetSource, setQuoteAssetSource] = useState<string>('crypto')

  const handleQuoteAssetSourceChange = (value: string) => {
    setQuoteAssetSource(value)
  }

  const handleFiatSelect = (currency: FiatCurrency) => {
    const fiatAsset: Asset = {
      name: currency.name,
      symbol: currency.code,
      slug: currency.code.toLowerCase(),
      img_url: '',
      variant: { FiatCurrency: null },
    }
    onSelect(fiatAsset)
  }

  return (
    <Tabs value={quoteAssetSource} onValueChange={handleQuoteAssetSourceChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
        <TabsTrigger value="fiat">Fiat Currency</TabsTrigger>
      </TabsList>
      <TabsContent value="crypto">
        <SearchableCurrencyList ref={ref} onSelect={onSelect} />
      </TabsContent>
      <TabsContent value="fiat">
        <SearchableFiatCurrencySelector onSelect={handleFiatSelect} />
      </TabsContent>
    </Tabs>
  )
})

QuoteAssetSelector.displayName = 'QuoteAssetSelector'