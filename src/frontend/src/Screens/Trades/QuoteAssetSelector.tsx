import { SearchableCurrencyList } from '@/Components/Currency/SearchableCurrencyList'
import { SearchableFiatCurrencySelector } from '@/Components/Currency/SearchableFiatCurrencySelector'
import { Asset } from '../../../../declarations/trade_manager/trade_manager.did'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface QuoteAssetSelectorProps {
  onSelect: (asset: Asset) => void
  ref: React.RefObject<any>
}

export const QuoteAssetSelector: FC<QuoteAssetSelectorProps> = ({ onSelect, ref }) => {
  const [quoteAssetSource, setQuoteAssetSource] = useState<string>('crypto')

  const handleQuoteAssetSourceChange = (value: string) => {
    setQuoteAssetSource(value)
  }

  const handleFiatSelect = (currency: Currency) => {
    const fiatAsset: Asset = {
      name: currency.name,
      symbol: currency.code,
      slug: currency.code.toLowerCase(),
      img_url: '',
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
}