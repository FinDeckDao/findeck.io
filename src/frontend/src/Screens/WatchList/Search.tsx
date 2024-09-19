import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { FixedSizeList as List } from 'react-window'
import { debounce } from 'lodash-es'
import currencyList from '../../lib/icons/coins.json'

// Define the type for our currency items
type CurrencyItem = {
  name: string
  symbol: string
  slug: string
  img_url: string
}

// Create an index for faster searching
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

  // Memoized search function
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

  // Debounced search effect
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

  // Render item for virtualized list
  const renderItem = useCallback(({ index }: { index: number }) => {
    const item = filteredList[index]
    return (
      <div>
        <Card className="m-2 overflow-hidden bg-dark text-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <img src={item.img_url} alt={item.name} className="w-12 h-12 object-contain" />
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
    <div className="p-4">
      <Input
        type="text"
        placeholder="Search currencies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-dark text-white"
      />
      <List
        height={400}
        itemCount={filteredList.length}
        itemSize={80}
        width="100%"
      >
        {renderItem}
      </List>
    </div>
  )
}

export default SearchableCurrencyList