import { PropsWithChildren, useContext, FC } from 'react'
import { DisplayContext } from '../../Contexts/Display'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PartialPosition } from "./types"

interface PositionTabsProps extends PropsWithChildren {
  partialPositions: PartialPosition[]
}

// Wraps the positions screen in some tabs that allow the user to select between cards and a table.
export const PositionTabs: FC<PositionTabsProps> = (props) => {
  const { children, partialPositions } = props
  const { display, setDisplay } = useContext(DisplayContext)

  const handleTabChange = (value: string) => {
    if (setDisplay) {
      setDisplay(value as 'cards' | 'table')
      localStorage.setItem('display', JSON.stringify(value))
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <h1 className="text-center">Positions</h1>
        {partialPositions.length < 1 ? (
          <Tabs value={display} onValueChange={handleTabChange} className="w-full">
            <TabsList className="justify-center mb-4">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <div className="rounded-lg">
              <TabsContent value="cards">{display === 'cards' && children}</TabsContent>
              <TabsContent value="table">{display === 'table' && children}</TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="p-4">{children}</div>
        )}
      </div>
    </div>
  )
}