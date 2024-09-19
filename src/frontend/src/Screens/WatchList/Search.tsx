import React, { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { debounce } from 'lodash-es'
import searchIndex from '../../../../fixtures/icons/searchIndex.json'

type CurrencyItem = {
  name: string
  symbol: string
  slug: string
  img_url: string
}

type SearchIndex = {
  items: CurrencyItem[]
  nameIndex: Record<string, number[]>
  symbolIndex: Record<string, number[]>
  slugIndex: Record<string, number[]>
}

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
  const [filteredList, setFilteredList] = useState<CurrencyItem[]>(searchIndex.items)

  const searchItems = useMemo(() =>
    (index: SearchIndex, term: string) => {
      if (term.trim() === '') return index.items
      const lowerTerm = term.toLowerCase()

      const exactMatches = new Set<number>()
      const partialMatches = new Set<number>()

      // Helper function to add matches
      const addMatches = (searchIndex: Record<string, number[]>, searchTerm: string, exact: boolean) => {
        Object.keys(searchIndex).forEach(key => {
          if (exact ? key === searchTerm : key.includes(searchTerm)) {
            searchIndex[key].forEach(idx =>
              exact ? exactMatches.add(idx) : partialMatches.add(idx)
            )
          }
        })
      }

      // Check for exact matches
      addMatches(index.nameIndex, lowerTerm, true)
      addMatches(index.symbolIndex, lowerTerm, true)
      addMatches(index.slugIndex, lowerTerm, true)

      // Check for partial matches
      addMatches(index.nameIndex, lowerTerm, false)
      addMatches(index.symbolIndex, lowerTerm, false)
      addMatches(index.slugIndex, lowerTerm, false)

      // Combine results, with exact matches first
      const results = [
        ...Array.from(exactMatches).map(i => index.items[i]),
        ...Array.from(partialMatches).filter(i => !exactMatches.has(i)).map(i => index.items[i])
      ]

      return results
    },
    []
  )

  useEffect(() => {
    const debouncedSearch = debounce((term: string) => {
      const results = searchItems(searchIndex as SearchIndex, term)
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