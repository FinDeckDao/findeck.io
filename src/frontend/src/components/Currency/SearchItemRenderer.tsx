import { FC, CSSProperties, memo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Asset } from '../../../../declarations/wishlist_manager/wishlist_manager.did'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Portal } from '@radix-ui/react-portal'

interface ItemRendererProps {
  data: Asset[]
  index: number
  style: CSSProperties
  onItemSelect: (item: Asset) => void
  selectedItem: Asset | null
}

export const ItemRenderer: FC<ItemRendererProps> = memo(({ data, index, style, onItemSelect, selectedItem }) => {
  const item = data[index]
  const isSelected = selectedItem && selectedItem.symbol === item.symbol
  const shouldTruncate = item.name.length > 24
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

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
            src={`https://4a5t6-wqaaa-aaaan-qzmpq-cai.icp0.io/assets/${item.img_url}`}
            alt={item.name}
            className="w-16 h-16 object-contain mb-4 flex-shrink-0"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <TooltipProvider>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger asChild>
                  <h3
                    className={`font-bold ${shouldTruncate ? 'truncate' : ''}`}
                    onMouseEnter={() => setIsTooltipOpen(true)}
                    onMouseLeave={() => setIsTooltipOpen(false)}
                  >
                    {item.name}
                  </h3>
                </TooltipTrigger>
                {shouldTruncate && isTooltipOpen && (
                  <Portal>
                    <TooltipContent
                      side="top"
                      align="start"
                      sideOffset={5}
                      className="z-[9999] bg-gray-800 text-white p-2 rounded shadow-lg"
                    >
                      <p className="max-w-xs break-words">{item.name}</p>
                    </TooltipContent>
                  </Portal>
                )}
              </Tooltip>
            </TooltipProvider>
            <p className="text-sm text-gray-500 truncate">{item.symbol}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

ItemRenderer.displayName = 'ItemRenderer'

export default ItemRenderer