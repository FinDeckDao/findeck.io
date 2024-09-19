import React, { useState, useEffect, useMemo, useCallback } from 'react'
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

export const SearchableCurrencyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredList, setFilteredList] = useState<CurrencyItem[]>(currencyList)

  const searchItems = useMemo(() =>
    (items: CurrencyItem[], term: string) => {
      if (term.trim() === '') return items
      const lowerTerm = term.toLowerCase()
      return Object.keys(searchIndex)
        .filter(key => key.includes(lowerTerm))
        .map(key => searchIndex[key])
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

  const ItemRenderer = useCallback(({ index, style }: { index: number, style: React.CSSProperties }) => {
    const item = filteredList[index]
    return (
      <div style={style}>
        <Card className="m-2 overflow-hidden bg-dark text-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <img src={item.img_url} alt={item.name} className="w-12 h-12 object-contain" loading="lazy" />
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.symbol}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }, [filteredList])

  return (
    <div className="p-4 h-full">
      <Input
        type="text"
        placeholder="Search currencies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-dark text-white"
      />
      <div style={{ height: 'calc(100% - 60px)' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={filteredList.length}
              itemSize={80}
              width={width}
              overscanCount={5}
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