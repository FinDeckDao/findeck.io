import { useState, useEffect, FC } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import currencies from '../../lib/icons/coins.json'

// Define the type for our currency items
type CurrencyItem = {
  name: string
  symbol: string
  slug: string
  img_url: string
}

export const SearchableCurrencyList: FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredList, setFilteredList] = useState<CurrencyItem[]>(currencies)

  useEffect(() => {
    const results = currencies.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredList(results)
  }, [searchTerm])

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="Search currencies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-dark"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((item) => (
          <Card key={item.slug} className="overflow-hidden">
            <CardContent className="p-4 flex items-center space-x-4">
              <img src={item.img_url} alt={item.name} className="w-12 h-12 object-contain" />
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.symbol}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SearchableCurrencyList