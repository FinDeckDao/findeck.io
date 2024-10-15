import React, { useState, useRef } from 'react'
import { Asset, WishlistItem } from '../../../../declarations/wishlist_manager/wishlist_manager.did'
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'
import { SearchableCurrencyList, SearchableCurrencyListRef } from '../../Components/Currency/SearchableCurrencyList'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AssetPairComponent } from './AssetPair'
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'

interface CreateTradeProps {
  userWishlist: WishlistItem[]
  onTradeDataChange: (tradeData: Partial<Trade>) => void
}

export const CreateTrade: React.FC<CreateTradeProps> = (props) => {
  const { userWishlist, onTradeDataChange } = props
  const [baseAssetSource, setBaseAssetSource] = useState<'wishlist' | 'search'>('wishlist')
  const [selectedBaseAsset, setSelectedBaseAsset] = useState<Asset | null>(null)
  const [selectedQuoteAsset, setSelectedQuoteAsset] = useState<Asset | null>(null)
  const [baseAssetAmount, setBaseAssetAmount] = useState<string>('')
  const [quoteAssetAmount, setQuoteAssetAmount] = useState<string>('')
  const [dateOfTrade, setDateOfTrade] = useState<Date | undefined>(undefined)

  const baseSearchRef = useRef<SearchableCurrencyListRef>(null)
  const quoteSearchRef = useRef<SearchableCurrencyListRef>(null)

  const handleBaseAssetSourceChange = (value: string) => {
    if (value === 'wishlist' || value === 'search') {
      setBaseAssetSource(value)
    }
  }

  const handleBaseAssetSelect = (asset: Asset | null) => {
    setSelectedBaseAsset(asset)
    setSelectedQuoteAsset(null)
  }

  return (
    <div className="space-y-6">
      {!selectedBaseAsset
        ? userWishlist.length > 0
          ? (
            <div>
              <h3 className="text-lg font-medium mb-2">
                Select Asset You Want To Buy
              </h3>
              <Tabs value={baseAssetSource} onValueChange={handleBaseAssetSourceChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wishlist">From Wishlist</TabsTrigger>
                  <TabsTrigger value="search">Search All Assets</TabsTrigger>
                </TabsList>
                <TabsContent value="wishlist">
                  <Select onValueChange={(value) => handleBaseAssetSelect(JSON.parse(value))}>
                    <SelectTrigger className="mb-4 bg-dark text-white">
                      <SelectValue placeholder="Select From Wishlist" className="bg-dark text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark text-white">
                      {userWishlist.map((item) => (
                        <SelectItem
                          key={item.base.slug}
                          value={JSON.stringify(item.base)}
                          className="text-white hover:bg-gray-700 focus:bg-gray-700 hover:text-white focus:text-white"
                        >
                          {item.base.name} ({item.base.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="search">
                  <SearchableCurrencyList ref={baseSearchRef} onSelect={handleBaseAssetSelect} />
                </TabsContent>
              </Tabs>
            </div>
          )
          : <SearchableCurrencyList ref={baseSearchRef} onSelect={handleBaseAssetSelect} />
        : null
      }

      {selectedBaseAsset && !selectedQuoteAsset && (
        <div>
          <h3 className="text-lg font-medium mb-2">Select Asset You Want To Pay With</h3>
          <SearchableCurrencyList
            ref={quoteSearchRef}
            onSelect={(asset) => {
              // Guard for an empty asset.
              if (!asset) { return }
              setSelectedQuoteAsset(asset)
              onTradeDataChange({
                assetPair: {
                  base: selectedBaseAsset,
                  quote: asset
                }
              })
            }}
          />
        </div>
      )}

      {selectedBaseAsset && selectedQuoteAsset && (
        <div className="space-y-4">
          <AssetPairComponent assetPair={{ base: selectedBaseAsset, quote: selectedQuoteAsset }} />
          <div>
            <Label htmlFor="baseAmount">
              {`Total Amount of ${selectedBaseAsset.symbol} Purchased`}
            </Label>
            <Input
              id="baseAmount"
              type="number"
              value={baseAssetAmount}
              onChange={(e) => {
                setBaseAssetAmount(e.target.value)
                onTradeDataChange({
                  baseAssetAmount: e.target.value ? Number(e.target.value) : undefined
                })
              }}
              placeholder={`Enter the total amount of ${selectedBaseAsset.symbol} you received.`}
              className='bg-dark text-white border-gray-700 focus:ring-gray-700 focus:border-gray-600 mt-2'
            />
          </div>
          <div>
            <Label htmlFor="quoteAmount mb-2">
              {`Total Amount of ${selectedQuoteAsset.symbol} Spent`}
            </Label>
            <Input
              id="quoteAmount"
              type="number"
              value={quoteAssetAmount}
              onChange={(e) => {
                setQuoteAssetAmount(e.target.value)
                onTradeDataChange({
                  quoteAssetAmount: e.target.value ? Number(e.target.value) : undefined
                })
              }}
              placeholder={`Enter the total amount of ${selectedQuoteAsset.symbol} you spent.`}
              className='bg-dark text-white border-gray-700 focus:ring-gray-700 focus:border-gray-600 mt-2'
            />
          </div>
          <div>
            <Label htmlFor="dateOfTrade">Date of Trade</Label>
            <Input
              id="tradeDate"
              disabled
              value={dateOfTrade ? format(dateOfTrade, "PPP") : ''}
              placeholder="Select a date from the picker below."
              className='bg-dark text-white border-gray-700 focus:ring-gray-700 focus:border-gray-600 mt-2'
            />
            <div className="mt-2 flex justify-center">
              <Calendar
                mode="single"
                selected={dateOfTrade}
                onSelect={(date) => {
                  setDateOfTrade(date)
                  if (date) {
                    onTradeDataChange({ dateOfTrade: BigInt(date.getTime()) })
                  }
                }}
                className="rounded-md border border-gray-700 bg-dark text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateTrade