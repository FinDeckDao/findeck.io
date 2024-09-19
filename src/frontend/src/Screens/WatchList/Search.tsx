import React, { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { debounce } from 'lodash-es'
import currencyList from '../../lib/icons/coins.json'

type CurrencyItem = {
  name: string
  symbol: string
  slug: string
  img_url: string
}

const createSearchIndex = (items: CurrencyItem[]) => {
  return items.reduce((acc, item) => {
    const searchString = `${item.name} ${item.symbol} ${item.slug}`.toLowerCase()
    acc[searchString] = item
    return acc
  }, {} as Record<string, CurrencyItem>)
}

const searchIndex = createSearchIndex(currencyList)

// Set a height for each item in the list to prevent from overlapping.
const ITEM_HEIGHT = 108

const ItemRenderer = React.memo(({ data, index, style }: { data: CurrencyItem[], index: number, style: React.CSSProperties }) => {
  const item = data[index]
  return (
    <div style={{
      ...style,
      height: `${parseInt(style.height as string) - 12}px`,
    }}>
      <Card className="bg-dark text-white h-full">
        <CardContent className="p-4 flex items-center space-x-4">
          <img
            src={item.img_url}
            alt={item.name}
            className="w-16 h-16 object-contain mb-4"
            loading="lazy"
          />
          <div>
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.symbol}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

ItemRenderer.displayName = 'ItemRenderer'

export const SearchableCurrencyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredList, setFilteredList] = useState<CurrencyItem[]>(currencyList)

  const searchItems = useMemo(() =>
    (items: CurrencyItem[], term: string) => {
      if (term.trim() === '') return items
      const lowerTerm = term.toLowerCase()

      const exactMatches: CurrencyItem[] = []
      const partialMatches: CurrencyItem[] = []

      Object.keys(searchIndex).forEach(key => {
        const item = searchIndex[key]
        if (item.name.toLowerCase() === lowerTerm ||
          item.symbol.toLowerCase() === lowerTerm ||
          item.slug.toLowerCase() === lowerTerm) {
          exactMatches.push(item)
        } else if (key.includes(lowerTerm)) {
          partialMatches.push(item)
        }
      })

      return [...exactMatches, ...partialMatches]
    },
    [searchIndex]
  )

  useEffect(() => {
    const debouncedSearch = debounce((term: string) => {
      const results = searchItems(currencyList, term)
      setFilteredList(results)
    }, 300)

    debouncedSearch(searchTerm)

    return () => {
      debouncedSearch.cancel()
    }
  }, [searchTerm, searchItems])

  const itemData = useMemo(() => filteredList, [filteredList])

  return (
    <div className="flex flex-col h-screen p-4">
      <Input
        type="text"
        placeholder="Search currencies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-dark text-white"
      />
      <div className="text-white mb-2 pl-2">
        {searchTerm ? (
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
              itemCount={filteredList.length}
              itemSize={ITEM_HEIGHT}
              width={width}
              itemData={itemData}
              overscanCount={5}
              className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300"
            >
              {ItemRenderer}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default SearchableCurrencyList