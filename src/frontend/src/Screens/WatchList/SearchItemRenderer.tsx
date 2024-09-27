import {
  FC,
  CSSProperties,
  memo
} from 'react'
import { Card, CardContent } from '@/components/ui/card'

type CurrencyItem = {
  name: string
  symbol: string
  slug: string
  img_url: string
}

interface ItemRendererProps {
  data: CurrencyItem[]
  index: number
  style: CSSProperties
  onItemSelect: (item: CurrencyItem) => void
  selectedItem: CurrencyItem | null
}

export const ItemRenderer: FC<ItemRendererProps> = memo(({ data, index, style, onItemSelect, selectedItem }) => {
  const item = data[index]
  const isSelected = selectedItem && selectedItem.symbol === item.symbol

  return (
    <div
      style={{
        ...style,
        height: `${parseInt(style.height as string) - 12}px`,
      }}
      onClick={() => onItemSelect(item)}
    >
      <Card className={`bg-dark text-white h-full cursor-pointer 
                      ${isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-gray-700'}`}
      >
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

export default ItemRenderer