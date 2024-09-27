import {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Input } from '@/components/ui/input'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import searchIndex from '../../../../fixtures/icons/searchIndex.json'
import { Asset } from '@/lib/asset'
import { ItemRenderer } from './SearchItemRenderer'

type CurrencyItem = {
  name: string
  symbol: string
  slug: string
  img_url: string
}

const ITEM_HEIGHT = 108

ItemRenderer.displayName = 'ItemRenderer'

interface SearchableCurrencyListProps {
  onSelect: (selectedAsset: Asset | null) => void
}

export interface SearchableCurrencyListRef {
  clearState: () => void
}

export const SearchableCurrencyList = forwardRef<SearchableCurrencyListRef, SearchableCurrencyListProps>(({ onSelect }, ref) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<CurrencyItem | null>(null)

  const filteredList = useMemo(() => {
    if (!searchTerm) return searchIndex.items
    const lowerSearchTerm = searchTerm.toLowerCase()

    const exactMatches: CurrencyItem[] = []
    const partialMatches: CurrencyItem[] = []

    searchIndex.items.forEach(item => {
      if (
        item.name.toLowerCase() === lowerSearchTerm ||
        item.symbol.toLowerCase() === lowerSearchTerm ||
        item.slug.toLowerCase() === lowerSearchTerm
      ) {
        exactMatches.push(item)
      } else if (
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.symbol.toLowerCase().includes(lowerSearchTerm) ||
        item.slug.toLowerCase().includes(lowerSearchTerm)
      ) {
        partialMatches.push(item)
      }
    })

    return [...exactMatches, ...partialMatches]
  }, [searchTerm])

  const clearState = useCallback(() => {
    setSearchTerm('')
    setSelectedItem(null)
  }, [])

  useImperativeHandle(ref, () => ({
    clearState
  }))

  const handleItemSelect = useCallback((item: CurrencyItem) => {
    if (selectedItem && selectedItem.symbol === item.symbol) {
      setSelectedItem(null)
      onSelect(null)
    } else {
      setSelectedItem(item)
      onSelect({
        name: item.name,
        symbol: item.symbol,
        img_url: item.img_url,
        slug: item.slug,
      })
    }
    setSearchTerm('')
  }, [selectedItem, onSelect])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setSelectedItem(null)
  }, [])

  const itemData = useMemo(() =>
    selectedItem ? [selectedItem] : filteredList,
    [selectedItem, filteredList]
  )

  return (
    <div className="flex flex-col h-screen p-4">
      <Input
        type="text"
        placeholder="Search currencies..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 bg-dark text-white"
      />
      <div className="text-white mb-2 pl-2">
        {selectedItem ? (
          "Selected Asset"
        ) : searchTerm ? (
          `Found ${filteredList.length} Matching Asset${filteredList.length !== 1 ? 's' : ''}`
        ) : (
          `${filteredList.length} Total Assets Available`
        )}
      </div>
      <div className="flex-grow">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={itemData.length}
              itemSize={ITEM_HEIGHT}
              width={width}
              itemData={itemData}
              overscanCount={5}
              className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300"
            >
              {({ data, index, style }) => (
                <ItemRenderer
                  data={data}
                  index={index}
                  style={style}
                  onItemSelect={handleItemSelect}
                  selectedItem={selectedItem}
                />
              )}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  )
})

SearchableCurrencyList.displayName = 'SearchableCurrencyList'

export default SearchableCurrencyList